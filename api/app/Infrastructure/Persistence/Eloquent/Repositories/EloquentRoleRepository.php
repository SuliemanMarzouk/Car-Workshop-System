<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EloquentRoleRepository implements RoleRepositoryInterface
{
    public function allWithPermissions(): Collection
    {
        return Role::query()
            ->with('permissions')
            ->withCount('users')
            ->orderByDesc('is_system')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id): ?Role
    {
        return Role::query()->find($id);
    }

    public function findByIdOrFail(int $id): Role
    {
        return Role::query()->findOrFail($id);
    }

    public function findBySlug(string $slug): ?Role
    {
        return Role::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Role
    {
        return Role::query()->create($attributes);
    }

    public function update(Role $role, array $attributes): Role
    {
        $role->update($attributes);

        return $role->fresh(['permissions']);
    }

    public function delete(Role $role): void
    {
        DB::transaction(function () use ($role): void {
            $role->permissions()->detach();
            $role->delete();
        });
    }

    public function detachPermissions(Role $role): void
    {
        $role->permissions()->detach();
    }
}
