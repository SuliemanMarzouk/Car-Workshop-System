<?php

declare(strict_types=1);

namespace App\Application\User\Actions;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListUsersAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(int $perPage = 15): LengthAwarePaginator
    {
        return $this->users->paginate($perPage);
    }
}
