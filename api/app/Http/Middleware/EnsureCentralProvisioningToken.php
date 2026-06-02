<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCentralProvisioningToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) config('tenancy.central_provisioning_token', env('CENTRAL_PROVISIONING_TOKEN', ''));

        if ($expected === '') {
            return response()->json([
                'message' => 'Central provisioning is disabled.',
            ], 403);
        }

        $provided = (string) $request->header('X-Central-Token', '');

        if (! hash_equals($expected, $provided)) {
            return response()->json([
                'message' => 'Invalid central provisioning token.',
            ], 403);
        }

        return $next($request);
    }
}

