<?php

namespace App\Providers;

use App\Application\Contracts\Repositories\CarRepositoryInterface;
use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentCarRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentInvoiceRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentWorkOrderRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CarRepositoryInterface::class, EloquentCarRepository::class);
        $this->app->bind(WorkOrderRepositoryInterface::class, EloquentWorkOrderRepository::class);
        $this->app->bind(InvoiceRepositoryInterface::class, EloquentInvoiceRepository::class);
    }
}
