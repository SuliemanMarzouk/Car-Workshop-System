<?php

namespace Tests\Feature;

use App\Domain\Authorization\Enums\Permission;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            \Database\Seeders\RolesAndPermissionsSeeder::class,
        ]);
    }

    public function test_user_endpoint_returns_flat_permissions_array(): void
    {
        $role = Role::query()->where('slug', RoleSlug::Viewer->value)->firstOrFail();

        $user = User::factory()->create([
            'email' => 'viewer@test.local',
            'password' => Hash::make('password'),
            'role_id' => $role->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/user');

        $response->assertOk()
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'role' => ['id', 'slug', 'name', 'name_ar'],
                'permissions',
            ])
            ->assertJsonMissing(['data' => []]);

        $permissions = $response->json('permissions');
        $this->assertIsArray($permissions);
        $this->assertContains(Permission::CarsView->value, $permissions);
        $this->assertNotContains(Permission::SettingsView->value, $permissions);
    }

    public function test_settings_route_returns_403_for_viewer(): void
    {
        $role = Role::query()->where('slug', RoleSlug::Viewer->value)->firstOrFail();

        $user = User::factory()->create([
            'role_id' => $role->id,
        ]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/dashboard/stats')
            ->assertOk();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/users')
            ->assertStatus(403);
    }
}
