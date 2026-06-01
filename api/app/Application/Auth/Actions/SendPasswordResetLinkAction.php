<?php

namespace App\Application\Auth\Actions;

use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class SendPasswordResetLinkAction
{
    public function execute(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);

        if ($status === Password::RESET_LINK_SENT) {
            return __($status);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
