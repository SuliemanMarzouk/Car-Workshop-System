<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Support;

use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class TenancyContextRunner
{
    /**
     * @template T
     * @param  callable(Tenant): T  $callback
     * @return T
     */
    public function run(string|Tenant $tenant, callable $callback): mixed
    {
        if (is_string($tenant)) {
            /** @var Tenant|null $model */
            $model = Tenant::query()->find($tenant);

            if ($model === null) {
                throw (new ModelNotFoundException())->setModel(Tenant::class, [$tenant]);
            }

            $tenant = $model;
        }

        $alreadyInitialized = tenancy()->initialized;

        if (! $alreadyInitialized) {
            tenancy()->initialize($tenant);
        }

        try {
            return $callback($tenant);
        } finally {
            if (! $alreadyInitialized) {
                tenancy()->end();
            }
        }
    }
}
