<?php

namespace App\Application\Authorization\Contracts;

use App\Infrastructure\Persistence\Eloquent\Models\User;

interface AuthorizerInterface
{
    public function authorize(User $user, string $permission): bool;
}
