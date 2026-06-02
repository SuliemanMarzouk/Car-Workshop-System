<?php

declare(strict_types=1);

namespace App\Application\Auth\Actions;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Application\Auth\Data\LoginCredentials;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(LoginCredentials $credentials): array
    {
        if (! Auth::guard('web')->attempt([
            'email' => $credentials->email,
            'password' => $credentials->password,
        ])) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $user = $this->users->findByEmailWithRolePermissionsOrFail($credentials->email);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }
}
