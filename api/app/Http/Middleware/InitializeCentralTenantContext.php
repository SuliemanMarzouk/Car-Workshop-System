<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Infrastructure\Tenancy\Models\Tenant;
use Closure;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Switches to a tenant database for central admin routes that manage tenant data.
 * Must run after central Sanctum auth so tokens stay on the central connection.
 */
class InitializeCentralTenantContext
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = $request->route('tenant');

        if (! is_string($tenantId) || $tenantId === '') {
            return response()->json(['message' => 'Tenant not specified.'], 404);
        }

        /** @var Tenant|null $tenant */
        $tenant = Tenant::query()->find($tenantId);

        if ($tenant === null) {
            throw (new ModelNotFoundException())->setModel(Tenant::class, [$tenantId]);
        }

        tenancy()->initialize($tenant);

        try {
            return $next($request);
        } finally {
            tenancy()->end();
        }
    }
}
