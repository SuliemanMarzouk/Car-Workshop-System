<?php

declare(strict_types=1);

namespace App\Application\Role\Actions;

use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Domain\Authorization\Enums\RoleSlug;
use Illuminate\Validation\ValidationException;

class DeleteRoleAction
{
    public function __construct(
        private readonly RoleRepositoryInterface $roles,
    ) {}

    public function execute(int $roleId): void
    {
        $role = $this->roles->findByIdOrFail($roleId);
        $role->loadCount('users');

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

        $this->roles->delete($role);
    }
}
