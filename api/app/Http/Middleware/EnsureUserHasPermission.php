<?php

namespace App\Http\Middleware;

use App\Application\Authorization\Contracts\AuthorizerInterface;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    public function __construct(
        private readonly AuthorizerInterface $authorizer,
    ) {}

    public function handle(Request $request, Closure $next, string $permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => __('auth.unauthorized'),
            ], 403);
        }

        $allowed = collect(explode(',', $permissions))
            ->map(trim(...))
            ->contains(fn (string $permission) => $this->authorizer->authorize($user, $permission));

        if (! $allowed) {
            return response()->json([
                'message' => __('auth.unauthorized'),
            ], 403);
        }

        return $next($request);
    }
}
