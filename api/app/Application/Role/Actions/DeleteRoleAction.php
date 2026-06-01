<?php

namespace App\Application\Role\Actions;

use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Validation\ValidationException;

class DeleteRoleAction
{
    public function execute(int $roleId): void
    {
        $role = Role::query()->withCount('users')->findOrFail($roleId);

        if ($role->is_system || $role->slug === RoleSlug::OrganizationAdmin->value) {
            throw ValidationException::withMessages([
                'role' => [__('roles.cannot_delete_system_role')],
            ]);
        }

        if ($role->users_count > 0) {
            throw ValidationException::withMessages([
                'role' => [__('roles.cannot_delete_role_in_use')],
            ]);
        }

        $role->permissions()->detach();
        $role->delete();
    }
}
