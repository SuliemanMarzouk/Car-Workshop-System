<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Http\Controllers\Controller;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Http\JsonResponse;

class PublicWorkshopController extends Controller
{
    public function show(string $tenantId): JsonResponse
    {
        /** @var Tenant|null $tenant */
        $tenant = Tenant::query()->find($tenantId);

        if ($tenant === null) {
            return response()->json([
                'exists' => false,
                'accessible' => false,
                'message' => __('tenancy.workshop_not_found', ['id' => $tenantId]),
            ], 404);
        }

        $status = $tenant->status instanceof TenantStatus
            ? $tenant->status
            : TenantStatus::tryFrom((string) $tenant->status) ?? TenantStatus::Active;

        $accessible = $status === TenantStatus::Active;

        return response()->json([
            'exists' => true,
            'accessible' => $accessible,
            'id' => (string) $tenant->id,
            'name' => $tenant->displayName(),
            'status' => $status->value,
            'domains' => $tenant->domains()->pluck('domain')->values()->all(),
            'message' => $accessible
                ? null
                : __('tenancy.workshop_suspended'),
        ], $accessible ? 200 : 403);
    }
}
