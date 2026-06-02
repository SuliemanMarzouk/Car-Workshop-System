<?php

declare(strict_types=1);

namespace App\Http\Support;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Infrastructure\Tenancy\Models\Tenant;

final class TenantApiResource
{
    /**
     * @return array{
     *     id: string,
     *     name: string,
     *     status: string,
     *     domains: list<string>,
     *     primary_domain: string|null,
     *     workshop_url: string|null,
     *     created_at: string|null
     * }
     */
    public static function toArray(Tenant $tenant): array
    {
        $domains = $tenant->domains->pluck('domain')->values()->all();
        $primaryDomain = $domains[0] ?? null;

        return [
            'id' => (string) $tenant->id,
            'name' => $tenant->displayName(),
            'status' => $tenant->status instanceof TenantStatus
                ? $tenant->status->value
                : (string) $tenant->status,
            'domains' => $domains,
            'primary_domain' => $primaryDomain,
            'workshop_url' => self::buildWorkshopUrl($primaryDomain),
            'created_at' => $tenant->created_at?->toISOString(),
        ];
    }

    public static function buildWorkshopUrl(?string $domain): ?string
    {
        if ($domain === null || $domain === '') {
            return null;
        }

        $scheme = (string) config('tenancy.workshop_access.scheme', 'http');
        $port = (string) config('tenancy.workshop_access.port', '4200');
        $portSuffix = ($port !== '' && $port !== '80' && $port !== '443') ? ":{$port}" : '';

        return "{$scheme}://{$domain}{$portSuffix}";
    }
}
