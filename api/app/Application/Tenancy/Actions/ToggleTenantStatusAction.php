<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Actions;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ToggleTenantStatusAction
{
    public function execute(string $tenantId, TenantStatus $status): Tenant
    {
        /** @var Tenant|null $tenant */
        $tenant = Tenant::query()->find($tenantId);

        if ($tenant === null) {
            throw (new ModelNotFoundException())->setModel(Tenant::class, [$tenantId]);
        }

        $tenant->status = $status;
        $tenant->save();

        return $tenant->fresh(['domains']) ?? $tenant;
    }
}
