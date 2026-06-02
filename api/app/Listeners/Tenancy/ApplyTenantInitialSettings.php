<?php

declare(strict_types=1);

namespace App\Listeners\Tenancy;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Application\Tenancy\Support\TenancyContextRunner;
use Stancl\Tenancy\Events\DatabaseSeeded;

/**
 * Fallback for tenants that still have persisted initial_settings in central metadata.
 * Primary path: CreateTenantAction applies the profile after provisioning.
 */
class ApplyTenantInitialSettings
{
    public function __construct(
        private readonly TenancyContextRunner $tenancy,
    ) {}

    public function handle(DatabaseSeeded $event): void
    {
        $tenant = $event->tenant->fresh();
        $initial = $this->resolveInitialSettings($tenant);

        if ($initial === null || $initial === []) {
            return;
        }

        $this->tenancy->run(
            $tenant,
            fn () => app(SettingRepositoryInterface::class)->setMany($initial),
        );
    }

    /** @return array<string, mixed>|null */
    private function resolveInitialSettings(\Stancl\Tenancy\Contracts\Tenant $tenant): ?array
    {
        $fromAttribute = $tenant->getAttribute('initial_settings');
        if (is_array($fromAttribute) && $fromAttribute !== []) {
            return $fromAttribute;
        }

        $data = $tenant->getAttribute('data');
        if (is_array($data) && is_array($data['initial_settings'] ?? null)) {
            return $data['initial_settings'];
        }

        return null;
    }
}
