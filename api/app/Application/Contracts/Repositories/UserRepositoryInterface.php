<?php

declare(strict_types=1);

namespace App\Application\Contracts\Repositories;

use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?User;

    public function findByIdOrFail(int $id): User;

    public function findByEmail(string $email): ?User;

    public function findByEmailWithRolePermissionsOrFail(string $email): User;

    public function create(array $attributes): User;

    public function update(User $user, array $attributes): User;

    public function delete(User $user): void;

    public function countByRoleSlug(string $slug): int;
}
