<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Infrastructure\Persistence\Eloquent\Models\User;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TenancyProvisioningTest extends TestCase
{
    public function test_creating_tenant_provisions_database_and_runs_tenant_migrations_and_seeders(): void
    {
        Artisan::call('migrate:fresh', ['--database' => 'central']);

        // Use unique tenant ids to avoid collisions with leftover sqlite files.
        $tenantId = 'workshop_' . bin2hex(random_bytes(4));

        $tenant = Tenant::create(['id' => $tenantId]);

        try {
            tenancy()->initialize($tenant);

            $this->assertTrue(Schema::hasTable('users'));
            $this->assertTrue(Schema::hasTable('settings'));

            $this->assertDatabaseHas('users', [
                'email' => 'admin@workshop.local',
            ]);
            $this->assertDatabaseHas('settings', [
                'key' => 'vat_rate',
            ]);
        } finally {
            tenancy()->end();
            $tenant->delete();
        }
    }

    public function test_api_requests_are_tenant_scoped_by_x_tenant_header(): void
    {
        Artisan::call('migrate:fresh', ['--database' => 'central']);

        $tenantId = 'workshop_' . bin2hex(random_bytes(4));
        $tenant = Tenant::create(['id' => $tenantId]);

        try {
            tenancy()->initialize($tenant);
            $admin = User::query()->where('email', 'admin@workshop.local')->firstOrFail();
            $token = $admin->createToken('test')->plainTextToken;
        } finally {
            tenancy()->end();
        }

        $response = $this
            ->withHeader('X-Tenant', $tenantId)
            ->withToken($token)
            ->getJson('/api/v1/settings');

        $response->assertOk();
        $response->assertJsonFragment([
            'vat_rate' => 0.15,
        ]);

        $tenant->delete();
    }
}

