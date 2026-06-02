<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Application\Tenancy\Actions\CreateTenantAction;
use App\Application\Tenancy\Actions\ListTenantsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreTenantRequest;
use Illuminate\Http\JsonResponse;

class CentralTenantController extends Controller
{
    public function index(ListTenantsAction $action): JsonResponse
    {
        $tenants = $action->execute();

        return response()->json($tenants->map(fn ($tenant) => [
            'id' => $tenant->id,
            'domains' => $tenant->domains->pluck('domain')->values(),
            'created_at' => $tenant->created_at?->toISOString(),
        ]));
    }

    public function store(StoreTenantRequest $request, CreateTenantAction $action): JsonResponse
    {
        $payload = $request->validated();

        $result = $action->execute(
            tenantId: (string) $payload['id'],
            domain: isset($payload['domain']) ? (string) $payload['domain'] : null,
        );

        return response()->json([
            'id' => $result['tenant']->id,
            'domain' => $result['domain']?->domain,
        ], 201);
    }
}

