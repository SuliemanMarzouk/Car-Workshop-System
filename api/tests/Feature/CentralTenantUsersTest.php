<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class CentralTenantUsersTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('migrate:fresh', ['--database' => 'central']);
        $this->seed(\Database\Seeders\CentralDatabaseSeeder::class);
    }

    public function test_super_admin_lists_and_creates_tenant_users(): void
    {
        $token = $this->centralToken();
        $tenantId = 'users_' . bin2hex(random_bytes(3));

        $this
            ->withToken($token)
            ->postJson('/api/v1/central/tenants', [
                'id' => $tenantId,
                'workshop_name' => 'Users Workshop',
                'phone' => '+966500000001',
                'email' => 'shop@example.com',
                'default_currency' => 'USD',
                'vat_rate' => 0.15,
            ])
            ->assertCreated();

        $roles = $this
            ->withToken($token)
            ->getJson("/api/v1/central/tenants/{$tenantId}/roles")
            ->assertOk()
            ->json();

        $this->assertNotEmpty($roles);
        $roleId = (int) $roles[0]['id'];

        $this
            ->withToken($token)
            ->postJson("/api/v1/central/tenants/{$tenantId}/users", [
                'name' => 'Shop Manager',
                'email' => 'manager@workshop.test',
                'password' => 'Password123!',
                'role_id' => $roleId,
            ])
            ->assertCreated()
            ->assertJsonPath('email', 'manager@workshop.test');

        $this
            ->withToken($token)
            ->getJson("/api/v1/central/tenants/{$tenantId}/users")
            ->assertOk()
            ->assertJsonPath('meta.total', 2);

        $userId = (int) $this
            ->withToken($token)
            ->getJson("/api/v1/central/tenants/{$tenantId}/users")
            ->json('data.1.id');

        $this
            ->withToken($token)
            ->patchJson("/api/v1/central/tenants/{$tenantId}/users/{$userId}/password", [
                'password' => 'NewPassword123!',
                'password_confirmation' => 'NewPassword123!',
            ])
            ->assertOk();
    }

    public function test_tenant_show_includes_primary_domain_and_workshop_url(): void
    {
        Tenant::withoutEvents(function (): void {
            Tenant::create(['id' => 'link_test', 'name' => 'Link Test']);
            Tenant::find('link_test')?->domains()->create(['domain' => 'link_test.localhost']);
        });

        $this
            ->withToken($this->centralToken())
            ->getJson('/api/v1/central/tenants/link_test')
            ->assertOk()
            ->assertJsonPath('primary_domain', 'link_test.localhost')
            ->assertJsonPath('workshop_url', 'http://link_test.localhost:4200');
    }

    private function centralToken(): string
    {
        return (string) $this->postJson('/api/v1/central/auth/login', [
            'email' => 'admin@platform.local',
            'password' => 'password',
        ])->json('access_token');
    }
}
