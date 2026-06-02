<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Infrastructure\Persistence\Eloquent\Models\CentralUser;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class CentralAdminTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('migrate:fresh', ['--database' => 'central']);
        $this->seed(\Database\Seeders\CentralDatabaseSeeder::class);
    }

    public function test_central_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/v1/central/dashboard/stats')
            ->assertUnauthorized();
    }

    public function test_super_admin_can_login_and_access_stats(): void
    {
        $token = $this->centralToken();

        $this
            ->withToken($token)
            ->getJson('/api/v1/central/dashboard/stats')
            ->assertOk()
            ->assertJsonStructure([
                'total_tenants',
                'active_tenants',
                'suspended_tenants',
                'recent_tenants',
            ]);
    }

    public function test_central_stats_reflect_tenant_status_counts(): void
    {
        Tenant::withoutEvents(function (): void {
            Tenant::create(['id' => 'alpha', 'name' => 'Alpha Workshop']);
            Tenant::create(['id' => 'beta', 'name' => 'Beta Workshop', 'status' => TenantStatus::Suspended]);
        });

        $this
            ->withToken($this->centralToken())
            ->getJson('/api/v1/central/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('total_tenants', 2)
            ->assertJsonPath('active_tenants', 1)
            ->assertJsonPath('suspended_tenants', 1)
            ->assertJsonCount(2, 'recent_tenants');
    }

    public function test_tenant_list_supports_search_and_status_toggle(): void
    {
        Tenant::withoutEvents(function (): void {
            Tenant::create(['id' => 'workshop_a', 'name' => 'Workshop A']);
            Tenant::create(['id' => 'other_b', 'name' => 'Other B']);
        });

        $token = $this->centralToken();

        $this
            ->withToken($token)
            ->getJson('/api/v1/central/tenants?search=Workshop')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', 'workshop_a');

        $this
            ->withToken($token)
            ->patchJson('/api/v1/central/tenants/workshop_a/status', [
                'status' => TenantStatus::Suspended->value,
            ])
            ->assertOk()
            ->assertJsonPath('status', TenantStatus::Suspended->value);
    }

    public function test_central_routes_reject_missing_or_invalid_bearer_token(): void
    {
        $this->getJson('/api/v1/central/tenants')->assertUnauthorized();

        $this
            ->withToken('invalid-token-value')
            ->getJson('/api/v1/central/tenants')
            ->assertUnauthorized();
    }

    private function centralToken(): string
    {
        $response = $this->postJson('/api/v1/central/auth/login', [
            'email' => 'admin@platform.local',
            'password' => 'password',
        ]);

        $response->assertOk();

        return (string) $response->json('access_token');
    }
}
