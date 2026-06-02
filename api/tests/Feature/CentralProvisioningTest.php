<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class CentralProvisioningTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('migrate:fresh', ['--database' => 'central']);
        $this->seed(\Database\Seeders\CentralDatabaseSeeder::class);
    }

    public function test_central_tenant_provisioning_requires_super_admin_auth(): void
    {
        $this->postJson('/api/v1/central/tenants', ['id' => 'workshopx'])
            ->assertUnauthorized();
    }

    public function test_super_admin_creates_tenant_and_allows_login_with_x_tenant_header(): void
    {
        $login = $this->postJson('/api/v1/central/auth/login', [
            'email' => 'admin@platform.local',
            'password' => 'password',
        ])->assertOk();

        $token = (string) $login->json('access_token');
        $tenantId = 'workshop_' . bin2hex(random_bytes(4));

        $this
            ->withToken($token)
            ->postJson('/api/v1/central/tenants', [
                'id' => $tenantId,
                'workshop_name' => 'Test Workshop',
                'phone' => '+966500000000',
                'email' => 'workshop@example.com',
                'default_currency' => 'USD',
                'vat_rate' => 0.15,
                'domain' => "{$tenantId}.localhost",
            ])
            ->assertCreated()
            ->assertJsonPath('id', $tenantId);

        $this
            ->withHeader('X-Tenant', $tenantId)
            ->postJson('/api/v1/login', [
                'email' => 'admin@workshop.local',
                'password' => 'password',
            ])
            ->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }
}
