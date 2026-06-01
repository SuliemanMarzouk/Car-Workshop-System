<?php

namespace App\Application\Auth\Actions;

use App\Application\Auth\Data\RegisterUserData;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function execute(RegisterUserData $data): array
    {
        $defaultRole = Role::query()
            ->where('slug', config('permissions.default_role'))
            ->first();

        $user = User::query()->create([
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
