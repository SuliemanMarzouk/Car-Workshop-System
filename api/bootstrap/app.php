<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedByRequestDataException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\App\Http\Middleware\Localization::class);
        $middleware->alias([
            'permission' => \App\Http\Middleware\EnsureUserHasPermission::class,
            'central.provision' => \App\Http\Middleware\EnsureCentralProvisioningToken::class,
            'central.admin' => \App\Http\Middleware\EnsureCentralAdmin::class,
            'central.tenant' => \App\Http\Middleware\InitializeCentralTenantContext::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (TenantCouldNotBeIdentifiedByRequestDataException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $payload = $request->header('X-Tenant') ?? $request->query('tenant');
            $message = is_string($payload) && $payload !== ''
                ? __('tenancy.workshop_not_found', ['id' => $payload])
                : __('tenancy.workshop_required');

            return response()->json([
                'message' => $message,
                'code' => (is_string($payload) && $payload !== '') ? 'workshop_not_found' : 'workshop_required',
            ], 404);
        });
    })->create();
