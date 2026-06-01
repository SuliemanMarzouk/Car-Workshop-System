<?php

namespace App\Infrastructure\Authorization;

use App\Application\Authorization\Contracts\AuthorizerInterface;
use App\Application\Authorization\Services\ResolveUserPermissions;
use App\Infrastructure\Persistence\Eloquent\Models\User;

final class PermissionAuthorizer implements AuthorizerInterface
{
    public function __construct(
        private readonly ResolveUserPermissions $permissions,
    ) {}

    public function authorize(User $user, string $permission): bool
    {
        return $this->permissions->has($user, $permission);
    }
}
