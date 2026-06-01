<?php

namespace App\Application\User\Actions;

use App\Application\User\Data\CreateUserData;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUserAction
{
    public function execute(CreateUserData $data): User
    {
        $user = User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'role_id' => $data->roleId,
        ]);

        return $user->load('role');
    }
}
