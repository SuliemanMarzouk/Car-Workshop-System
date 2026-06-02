<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Infrastructure\Tenancy\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RejectSuspendedTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Tenant|null $tenant */
        $tenant = tenant();

        if ($tenant !== null) {
            $status = $tenant->status;
            if ($status === TenantStatus::Suspended) {
                return response()->json([
                    'message' => __('tenancy.workshop_suspended'),
                    'code' => 'workshop_suspended',
                ], 403);
            }
        }

        return $next($request);
    }
}
