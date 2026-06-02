<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CarController;
use App\Http\Controllers\Api\V1\CentralTenantController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\InvoiceController;
use App\Http\Controllers\Api\V1\PasswordResetController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\WorkOrderController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByRequestData;

Route::prefix('v1')->group(function () {
    Route::prefix('central')->middleware('central.provision')->group(function () {
        Route::get('/tenants', [CentralTenantController::class, 'index']);
        Route::post('/tenants', [CentralTenantController::class, 'store']);
    });

    Route::middleware([InitializeTenancyByRequestData::class])->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email');
        Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.reset');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user', [AuthController::class, 'user']);

            Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
                ->middleware('permission:dashboard.view');

        Route::get('/permissions', [PermissionController::class, 'index'])
            ->middleware('permission:roles.view,roles.create,roles.update');

        Route::get('/roles', [RoleController::class, 'index'])
            ->middleware('permission:roles.view,users.create,users.update');
        Route::post('/roles', [RoleController::class, 'store'])
            ->middleware('permission:roles.create');
        Route::put('/roles/{role}', [RoleController::class, 'update'])
            ->middleware('permission:roles.update');
        Route::patch('/roles/{role}', [RoleController::class, 'update'])
            ->middleware('permission:roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
            ->middleware('permission:roles.delete');

        Route::get('/users', [UserController::class, 'index'])
            ->middleware('permission:users.view');
        Route::post('/users', [UserController::class, 'store'])
            ->middleware('permission:users.create');
        Route::put('/users/{user}', [UserController::class, 'update'])
            ->middleware('permission:users.update');
        Route::patch('/users/{user}', [UserController::class, 'update'])
            ->middleware('permission:users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->middleware('permission:users.delete');

        Route::get('/cars', [CarController::class, 'index'])
            ->middleware('permission:cars.view');
        Route::post('/cars', [CarController::class, 'store'])
            ->middleware('permission:cars.create');
        Route::get('/cars/{car}', [CarController::class, 'show'])
            ->middleware('permission:cars.view');
        Route::put('/cars/{car}', [CarController::class, 'update'])
            ->middleware('permission:cars.update');
        Route::patch('/cars/{car}', [CarController::class, 'update'])
            ->middleware('permission:cars.update');
        Route::delete('/cars/{car}', [CarController::class, 'destroy'])
            ->middleware('permission:cars.delete');

        Route::get('/work-orders', [WorkOrderController::class, 'index'])
            ->middleware('permission:work_orders.view');
        Route::post('/work-orders', [WorkOrderController::class, 'store'])
            ->middleware('permission:work_orders.create');
        Route::get('/work-orders/{work_order}', [WorkOrderController::class, 'show'])
            ->middleware('permission:work_orders.view');
        Route::put('/work-orders/{work_order}', [WorkOrderController::class, 'update'])
            ->middleware('permission:work_orders.update');
        Route::patch('/work-orders/{work_order}', [WorkOrderController::class, 'update'])
            ->middleware('permission:work_orders.update');
        Route::delete('/work-orders/{work_order}', [WorkOrderController::class, 'destroy'])
            ->middleware('permission:work_orders.delete');

        Route::get('/invoices', [InvoiceController::class, 'index'])
            ->middleware('permission:invoices.view');
        Route::post('/invoices', [InvoiceController::class, 'store'])
            ->middleware('permission:invoices.create');
        Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
            ->middleware('permission:invoices.view');

        Route::get('/settings/workshop', [SettingsController::class, 'workshop'])
            ->middleware('permission:invoices.view,invoices.create,settings.view');
        Route::get('/settings', [SettingsController::class, 'index'])
            ->middleware('permission:settings.view');
        Route::put('/settings', [SettingsController::class, 'update'])
            ->middleware('permission:settings.update');
            Route::patch('/settings', [SettingsController::class, 'update'])
                ->middleware('permission:settings.update');
        });
    });
});
