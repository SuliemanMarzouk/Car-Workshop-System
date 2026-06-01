<?php

namespace App\Application\Auth\Actions;

use App\Infrastructure\Persistence\Eloquent\Models\User;

class LogoutUserAction
{
    public function execute(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
