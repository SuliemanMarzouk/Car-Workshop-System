<?php

declare(strict_types=1);

namespace App\Application\Central\Auth\Actions;

use App\Infrastructure\Persistence\Eloquent\Models\CentralUser;
use Laravel\Sanctum\PersonalAccessToken;

class LogoutCentralUserAction
{
    public function execute(CentralUser $user): void
    {
        /** @var PersonalAccessToken|null $token */
        $token = $user->currentAccessToken();
        $token?->delete();
    }
}
