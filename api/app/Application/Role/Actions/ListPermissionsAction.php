<?php

namespace App\Application\Role\Actions;

use App\Infrastructure\Persistence\Eloquent\Models\Permission;
use Illuminate\Support\Collection;

class ListPermissionsAction
{
    /** @return Collection<int, Permission> */
    public function execute(): Collection
    {
        return Permission::query()->orderBy('slug')->get();
    }
}
