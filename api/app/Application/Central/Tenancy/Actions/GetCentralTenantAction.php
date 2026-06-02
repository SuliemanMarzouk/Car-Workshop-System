<?php

declare(strict_types=1);

namespace App\Application\Central\Tenancy\Actions;

use App\Infrastructure\Tenancy\Models\Tenant;

class GetCentralTenantAction
{
    public function execute(string $tenantId): Tenant
    {
        /** @var Tenant $tenant */
        $tenant = Tenant::query()
            ->with('domains')
            ->findOrFail($tenantId);

        return $tenant;
    }
}
