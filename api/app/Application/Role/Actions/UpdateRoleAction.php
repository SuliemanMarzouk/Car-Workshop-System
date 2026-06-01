<?php

namespace App\Application\Role\Actions;

use App\Application\Role\Data\UpdateRoleData;
use App\Application\Role\Services\RoleSlugGenerator;
use App\Application\Role\Services\SyncRolePermissions;
use App\Domain\Authorization\Enums\Permission;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Validation\ValidationException;

class UpdateRoleAction
{
    public function __construct(
        private readonly RoleSlugGenerator $slugGenerator,
        private readonly SyncRolePermissions $syncPermissions,
    ) {}

    public function execute(int $roleId, UpdateRoleData $data): Role
    {
        $role = Role::query()->with('permissions')->withCount('users')->findOrFail($roleId);

        $payload = [
            'name' => $data->name,
            'name_ar' => $data->nameAr,
        ];

        if (! $role->is_system && $data->slug) {
            $payload['slug'] = $this->slugGenerator->generate($data->name, $data->slug, $role->id);
        }

        if ($role->is_system && $data->slug && $data->slug !== $role->slug) {
            throw ValidationException::withMessages([
                'slug' => [__('roles.cannot_change_system_slug')],
            ]);
        }

        $permissions = $role->slug === RoleSlug::OrganizationAdmin->value
            ? Permission::values()
            : $data->permissions;

        $role->update($payload);
        $this->syncPermissions->sync($role, $permissions);

        return $role->fresh(['permissions'])->loadCount('users');
    }
}
