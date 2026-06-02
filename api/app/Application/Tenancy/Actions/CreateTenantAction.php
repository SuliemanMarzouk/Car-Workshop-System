<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Actions;

use App\Infrastructure\Tenancy\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class CreateTenantAction
{
    /**
     * @return array{tenant: Tenant, domain: Domain|null}
     */
    public function execute(string $tenantId, ?string $domain = null): array
    {
        /** @var Tenant $tenant */
        $tenant = Tenant::create(['id' => $tenantId]);

        $domainModel = null;
        if ($domain) {
            $domainModel = $tenant->domains()->create([
                'domain' => $domain,
            ]);
        }

        return [
            'tenant' => $tenant,
            'domain' => $domainModel,
        ];
    }
}

