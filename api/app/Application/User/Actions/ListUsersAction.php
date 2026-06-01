<?php

namespace App\Application\User\Actions;

use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListUsersAction
{
    public function execute(int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('role')
            ->orderBy('name')
            ->paginate($perPage);
    }
}
