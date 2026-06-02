<?php

declare(strict_types=1);

namespace App\Application\Central\Dashboard\Actions;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Infrastructure\Tenancy\Models\Tenant;

class GetCentralStatsAction
{
    /**
     * @return array{
     *     total_tenants: int,
     *     active_tenants: int,
     *     suspended_tenants: int,
     *     recent_tenants: list<array{
     *         id: string,
     *         name: string,
     *         status: string,
     *         domains: list<string>,
     *         created_at: string|null
     *     }>
     * }
     */
    public function execute(): array
    {
        $total = Tenant::query()->count();
        $active = Tenant::query()->where('status', TenantStatus::Active)->count();
        $suspended = Tenant::query()->where('status', TenantStatus::Suspended)->count();

        $recent = Tenant::query()
            ->with('domains')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Tenant $tenant) => $this->serializeTenantSummary($tenant))
            ->values()
            ->all();

        return [
            'total_tenants' => $total,
            'active_tenants' => $active,
            'suspended_tenants' => $suspended,
            'recent_tenants' => $recent,
        ];
    }

    /**
     * @return array{
     *     id: string,
     *     name: string,
     *     status: string,
     *     domains: list<string>,
     *     created_at: string|null
     * }
     */
    private function serializeTenantSummary(Tenant $tenant): array
    {
        return [
            'id' => (string) $tenant->id,
            'name' => $tenant->displayName(),
            'status' => $tenant->status instanceof TenantStatus
                ? $tenant->status->value
                : (string) $tenant->status,
            'domains' => $tenant->domains->pluck('domain')->values()->all(),
            'created_at' => $tenant->created_at?->toISOString(),
        ];
    }
}
