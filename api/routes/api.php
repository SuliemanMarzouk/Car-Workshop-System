<?php

use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email');
Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.reset');


// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// CRUD Routes (Temporarily Public for Testing)
Route::apiResource('cars', CarController::class);
Route::apiResource('work-orders', WorkOrderController::class);
Route::apiResource('invoices', InvoiceController::class);
