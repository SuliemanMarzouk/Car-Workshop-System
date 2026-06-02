<?php

declare(strict_types=1);

namespace App\Application\Central\Tenancy\Actions;

use App\Application\Tenancy\Support\TenancyContextRunner;
use App\Application\User\Actions\CreateUserAction;
use App\Application\User\Actions\ListUsersAction;
use App\Application\User\Data\CreateUserData;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class ListCentralTenantUsersAction
{
    public function __construct(
        private readonly TenancyContextRunner $tenancy,
        private readonly ListUsersAction $listUsers,
    ) {}

    /** @return LengthAwarePaginator<int, User> */
    public function execute(string $tenantId, int $perPage = 25): LengthAwarePaginator
    {
        return $this->tenancy->run($tenantId, fn () => $this->listUsers->execute($perPage));
    }
}
