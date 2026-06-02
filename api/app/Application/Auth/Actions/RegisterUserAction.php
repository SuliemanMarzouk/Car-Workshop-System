<?php

declare(strict_types=1);

namespace App\Application\Auth\Actions;

use App\Application\Auth\Data\RegisterUserData;
use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Application\Contracts\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(
        private readonly RoleRepositoryInterface $roles,
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(RegisterUserData $data): array
    {
        $defaultRoleSlug = (string) config('permissions.default_role');
        $defaultRole = $this->roles->findBySlug($defaultRoleSlug);

        $user = $this->users->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'role_id' => $defaultRole?->id,
        ]);

        $user->load('role.permissions');

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }
}
