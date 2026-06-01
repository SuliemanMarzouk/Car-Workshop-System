<?php

declare(strict_types=1);

namespace App\Application\User\Actions;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Application\User\Data\CreateUserData;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(CreateUserData $data): User
    {
        return $this->users->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'role_id' => $data->roleId,
        ])->load('role');
    }
}
