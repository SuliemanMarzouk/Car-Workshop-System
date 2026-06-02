<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Actions;

use App\Application\Tenancy\Data\ListTenantsQuery;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListTenantsAction
{
    /** @return LengthAwarePaginator<int, Tenant> */
    public function execute(ListTenantsQuery $query): LengthAwarePaginator
    {
        $builder = Tenant::query()
            ->with('domains')
            ->orderByDesc('created_at');

        if ($query->search !== null) {
            $term = '%' . addcslashes($query->search, '%_\\') . '%';
            $builder->where(function ($q) use ($term) {
                $q->where('id', 'like', $term)
                    ->orWhere('name', 'like', $term)
                    ->orWhereHas('domains', fn ($domainQuery) => $domainQuery->where('domain', 'like', $term));
            });
        }

        return $builder->paginate(
            perPage: $query->perPage,
            page: $query->page,
        );
    }
}
