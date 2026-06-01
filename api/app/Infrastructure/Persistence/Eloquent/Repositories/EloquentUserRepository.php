<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('role')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function findByIdOrFail(int $id): User
    {
        return User::query()->findOrFail($id);
    }

    public function create(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function update(User $user, array $attributes): User
    {
        $user->update($attributes);

        return $user->fresh(['role']);
    }

    public function delete(User $user): void
    {
        $user->tokens()->delete();
        $user->delete();
    }

    public function countByRoleSlug(string $slug): int
    {
        return User::query()
            ->whereHas('role', fn ($query) => $query->where('slug', $slug))
            ->count();
    }
}
