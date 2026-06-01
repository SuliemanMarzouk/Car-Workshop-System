<?php

declare(strict_types=1);

namespace App\Application\WorkOrder\Actions;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Domain\WorkOrder\Events\WorkOrderApproved;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveWorkOrderAction
{
    public function __construct(
        private readonly WorkOrderRepositoryInterface $workOrders,
        private readonly GetWorkOrderAction $getWorkOrder,
    ) {}

    public function execute(int $id, int $approvedBy): WorkOrder
    {
        return DB::transaction(function () use ($id, $approvedBy): WorkOrder {
            $workOrder = $this->getWorkOrder->execute($id);

            if ($workOrder->status !== WorkOrderStatus::Pending->value) {
                throw ValidationException::withMessages([
                    'status' => [__('Only pending work orders can be approved.')],
                ]);
            }

            $updated = $this->workOrders->update($workOrder, [
                'status' => WorkOrderStatus::Approved->value,
                'approved_by' => $approvedBy,
            ]);

            WorkOrderApproved::dispatch($updated, $approvedBy);

            return $updated;
        });
    }
}
