<?php

declare(strict_types=1);

namespace App\Application\Central\Tenancy\Actions;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Application\Tenancy\Support\TenancyContextRunner;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetCentralTenantUserPasswordAction
{
    public function __construct(
        private readonly TenancyContextRunner $tenancy,
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(string $tenantId, int $userId, string $password): User
    {
        return $this->tenancy->run($tenantId, function () use ($userId, $password) {
            $user = $this->users->findByIdOrFail($userId);

            return $this->users->update($user, [
                'password' => Hash::make($password),
            ]);
        });
    }
}
