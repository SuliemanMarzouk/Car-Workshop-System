<?php

declare(strict_types=1);

namespace App\Application\Central\Tenancy\Actions;

use App\Application\Tenancy\Support\TenancyContextRunner;
use App\Application\User\Actions\CreateUserAction;
use App\Application\User\Data\CreateUserData;
use App\Infrastructure\Persistence\Eloquent\Models\User;

class CreateCentralTenantUserAction
{
    public function __construct(
        private readonly TenancyContextRunner $tenancy,
        private readonly CreateUserAction $createUser,
    ) {}

    public function execute(string $tenantId, CreateUserData $data): User
    {
        return $this->tenancy->run(
            $tenantId,
            fn () => $this->createUser->execute($data),
        );
    }
}
