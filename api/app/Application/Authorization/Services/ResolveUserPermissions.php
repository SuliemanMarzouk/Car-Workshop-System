<?php

namespace App\Application\Authorization\Services;

use App\Domain\Authorization\Enums\Permission;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\User;

final class ResolveUserPermissions
{
    public function has(User $user, string $permission): bool
    {
        if (! in_array($permission, Permission::values(), true)) {
            return false;
        }

        if ($user->role?->slug === RoleSlug::OrganizationAdmin->value) {
            return true;
        }

        $this->ensureRoleLoaded($user);

        return $user->role?->permissions->contains('slug', $permission) ?? false;
    }

    /** @return list<string> */
    public function slugsFor(User $user): array
    {
        if ($user->role?->slug === RoleSlug::OrganizationAdmin->value) {
            return Permission::values();
        }

        $this->ensureRoleLoaded($user);

        if (! $user->role) {
            return [];
        }

        return $user->role->permissions
            ->pluck('slug')
            ->values()
            ->all();
    }

    private function ensureRoleLoaded(User $user): void
    {
        if (! $user->relationLoaded('role')) {
            $user->load('role.permissions');

            return;
        }

        if ($user->role && ! $user->role->relationLoaded('permissions')) {
            $user->role->load('permissions');
        }
    }
}
