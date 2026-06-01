<?php

namespace App\Providers;

use App\Application\Contracts\Repositories\CarRepositoryInterface;
use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentCarRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentInvoiceRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentRoleRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentSettingRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentWorkOrderRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CarRepositoryInterface::class, EloquentCarRepository::class);
        $this->app->bind(WorkOrderRepositoryInterface::class, EloquentWorkOrderRepository::class);
        $this->app->bind(InvoiceRepositoryInterface::class, EloquentInvoiceRepository::class);
        $this->app->bind(SettingRepositoryInterface::class, EloquentSettingRepository::class);
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, EloquentRoleRepository::class);
    }
}
