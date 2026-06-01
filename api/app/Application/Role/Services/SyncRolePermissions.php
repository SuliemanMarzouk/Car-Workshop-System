<?php

namespace App\Application\Role\Services;

use App\Domain\Authorization\Enums\Permission;
use App\Infrastructure\Persistence\Eloquent\Models\Permission as PermissionModel;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Validation\ValidationException;

final class SyncRolePermissions
{
    /**
     * @param  list<string>  $permissionSlugs
     */
    public function sync(Role $role, array $permissionSlugs): void
    {
        $validSlugs = Permission::values();
        $requested = collect($permissionSlugs)->unique()->values();

        $invalid = $requested->reject(fn (string $slug) => in_array($slug, $validSlugs, true));

        if ($invalid->isNotEmpty()) {
            throw ValidationException::withMessages([
                'permissions' => [__('roles.invalid_permissions')],
            ]);
        }

        $permissionIds = PermissionModel::query()
            ->whereIn('slug', $requested->all())
            ->pluck('id');

        $role->permissions()->sync($permissionIds);
    }
}
