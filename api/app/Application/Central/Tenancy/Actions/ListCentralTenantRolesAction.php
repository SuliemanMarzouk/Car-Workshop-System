<?php

declare(strict_types=1);

namespace App\Application\Central\Tenancy\Actions;

use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Application\Tenancy\Support\TenancyContextRunner;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Collection;

class ListCentralTenantRolesAction
{
    public function __construct(
        private readonly TenancyContextRunner $tenancy,
        private readonly RoleRepositoryInterface $roles,
    ) {}

    /** @return Collection<int, Role> */
    public function execute(string $tenantId): Collection
    {
        return $this->tenancy->run($tenantId, fn () => $this->roles->allWithPermissions());
    }
}
