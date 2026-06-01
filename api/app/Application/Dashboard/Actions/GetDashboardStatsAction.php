<?php

namespace App\Application\Dashboard\Actions;

use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Infrastructure\Persistence\Eloquent\Models\Car;
use App\Infrastructure\Persistence\Eloquent\Models\Invoice;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;

class GetDashboardStatsAction
{
    public function execute(): array
    {
        return [
            'total_cars' => Car::query()->count(),
            'pending_work_orders' => WorkOrder::query()
                ->where('status', WorkOrderStatus::Pending->value)
                ->count(),
            'approved_work_orders' => WorkOrder::query()
                ->where('status', WorkOrderStatus::Approved->value)
                ->count(),
            'invoices_total_today' => (float) Invoice::query()
                ->whereDate('created_at', today())
                ->sum('total'),
        ];
    }
}
