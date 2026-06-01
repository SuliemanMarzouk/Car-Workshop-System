<?php

namespace App\Application\Auth\Actions;

use App\Application\Auth\Data\AuthenticatedUserData;
use App\Application\Authorization\Services\ResolveUserPermissions;
use App\Infrastructure\Persistence\Eloquent\Models\User;

class GetAuthenticatedUserAction
{
    public function __construct(
        private readonly ResolveUserPermissions $permissions,
    ) {}

    public function execute(User $user): AuthenticatedUserData
    {
        return AuthenticatedUserData::fromUser($user, $this->permissions);
    }
}
