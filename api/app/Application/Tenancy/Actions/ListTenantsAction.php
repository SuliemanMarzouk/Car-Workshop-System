<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Actions;

use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Support\Collection;

class ListTenantsAction
{
    /** @return Collection<int, Tenant> */
    public function execute(): Collection
    {
        return Tenant::query()
            ->with('domains')
            ->orderBy('id')
            ->get();
    }
}

