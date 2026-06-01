<?php

declare(strict_types=1);

namespace App\Application\Role\Actions;

use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Collection;

class ListRolesAction
{
    public function __construct(
        private readonly RoleRepositoryInterface $roles,
    ) {}

    /** @return Collection<int, Role> */
    public function execute(): Collection
    {
        return $this->roles->allWithPermissions();
    }
}
