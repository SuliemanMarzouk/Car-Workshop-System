<?php

declare(strict_types=1);

namespace App\Application\Central\Auth\Actions;

use App\Application\Central\Auth\Data\CentralLoginCredentials;
use App\Infrastructure\Persistence\Eloquent\Models\CentralUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CentralLoginAction
{
    /**
     * @return array{access_token: string, token_type: string, user: CentralUser}
     */
    public function execute(CentralLoginCredentials $credentials): array
    {
        if (! Auth::guard('central')->attempt([
            'email' => $credentials->email,
            'password' => $credentials->password,
        ])) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        /** @var CentralUser $user */
        $user = Auth::guard('central')->user();
        Auth::guard('central')->logout();

        $token = $user->createToken('central_auth')->plainTextToken;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }
}
