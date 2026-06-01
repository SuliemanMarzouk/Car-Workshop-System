<?php

namespace App\Application\Auth\Actions;

use App\Application\Auth\Data\LoginCredentials;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginUserAction
{
    public function execute(LoginCredentials $credentials): array
    {
        if (! Auth::attempt([
            'email' => $credentials->email,
            'password' => $credentials->password,
        ])) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $user = User::query()
            ->with('role.permissions')
            ->where('email', $credentials->email)
            ->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }
}
