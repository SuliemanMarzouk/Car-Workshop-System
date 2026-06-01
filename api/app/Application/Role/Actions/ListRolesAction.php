<?php

namespace App\Application\Role\Actions;

use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Collection;

class ListRolesAction
{
    /** @return Collection<int, Role> */
    public function execute(): Collection
    {
        return Role::query()
            ->with('permissions')
            ->withCount('users')
            ->orderByDesc('is_system')
            ->orderBy('name')
            ->get();
    }
}
