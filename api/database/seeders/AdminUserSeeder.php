<?php

namespace Database\Seeders;

use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::query()->where('slug', RoleSlug::OrganizationAdmin->value)->first();

        if (! $adminRole) {
            return;
        }

        User::query()->updateOrCreate(
            ['email' => 'admin@workshop.local'],
            [
                'name' => 'Workshop Admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ],
        );
    }
}
