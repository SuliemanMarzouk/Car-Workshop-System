<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Application\Central\Tenancy\Actions\GetCentralTenantAction;
use App\Application\Tenancy\Actions\CreateTenantAction;
use App\Application\Tenancy\Data\CreateTenantProfileData;
use App\Application\Tenancy\Actions\ListTenantsAction;
use App\Application\Tenancy\Actions\ToggleTenantStatusAction;
use App\Application\Tenancy\Data\ListTenantsQuery;
use App\Domain\Tenancy\Enums\TenantStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\ListTenantsRequest;
use App\Http\Requests\Tenant\StoreTenantRequest;
use App\Http\Requests\Tenant\ToggleTenantStatusRequest;
use App\Http\Support\TenantApiResource;
use Illuminate\Http\JsonResponse;

class CentralTenantController extends Controller
{
    public function index(ListTenantsRequest $request, ListTenantsAction $action): JsonResponse
    {
        $paginator = $action->execute(ListTenantsQuery::fromValidated($request->validated()));

        return response()->json([
            'data' => $paginator->getCollection()
                ->map(fn ($tenant) => TenantApiResource::toArray($tenant))
                ->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(string $tenant, GetCentralTenantAction $action): JsonResponse
    {
        return response()->json(TenantApiResource::toArray($action->execute($tenant)));
    }

    public function store(StoreTenantRequest $request, CreateTenantAction $action): JsonResponse
    {
        $payload = $request->validated();

        $profile = CreateTenantProfileData::fromValidated($payload);

        $result = $action->execute(
            tenantId: (string) $payload['id'],
            profile: $profile,
            domain: isset($payload['domain']) ? (string) $payload['domain'] : null,
        );

        return response()->json(
            TenantApiResource::toArray($result['tenant']->load('domains')),
            201,
        );
    }

    public function updateStatus(
        string $tenant,
        ToggleTenantStatusRequest $request,
        ToggleTenantStatusAction $action,
    ): JsonResponse {
        $status = TenantStatus::from((string) $request->validated('status'));
        $updated = $action->execute($tenant, $status);

        return response()->json(TenantApiResource::toArray($updated));
    }
}
