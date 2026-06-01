<?php

declare(strict_types=1);

namespace App\Application\Contracts\Repositories;

use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Collection;

interface RoleRepositoryInterface
{
    /** @return Collection<int, Role> */
    public function allWithPermissions(): Collection;

    public function findById(int $id): ?Role;

    public function findByIdOrFail(int $id): Role;

    public function create(array $attributes): Role;

    public function update(Role $role, array $attributes): Role;

    public function delete(Role $role): void;

    public function detachPermissions(Role $role): void;
}
