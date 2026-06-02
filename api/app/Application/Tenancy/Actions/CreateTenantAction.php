<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Actions;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Application\Tenancy\Data\CreateTenantProfileData;
use App\Application\Tenancy\Support\TenancyContextRunner;
use App\Infrastructure\Tenancy\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class CreateTenantAction
{
    public function __construct(
        private readonly TenancyContextRunner $tenancy,
        private readonly SettingRepositoryInterface $settings,
    ) {}

    /**
     * @return array{tenant: Tenant, domain: Domain}
     */
    public function execute(
        string $tenantId,
        CreateTenantProfileData $profile,
        ?string $domain = null,
    ): array {
        $domainHost = $domain ?: "{$tenantId}.localhost";

        /** @var Tenant $tenant */
        $tenant = Tenant::create([
            'id' => $tenantId,
            'name' => $profile->workshopName,
        ]);

        $domainModel = $tenant->domains()->create([
            'domain' => $domainHost,
        ]);

        // Stancl provisioning overwrites tenant `data`; apply profile after DB seed completes.
        $this->tenancy->run(
            $tenant,
            fn () => $this->settings->setMany($profile->toInitialSettingsArray()),
        );

        return [
            'tenant' => $tenant->fresh(['domains']) ?? $tenant,
            'domain' => $domainModel,
        ];
    }
}
