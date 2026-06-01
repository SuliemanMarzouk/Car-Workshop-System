<?php

declare(strict_types=1);

namespace App\Application\WorkOrder\Actions;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Application\WorkOrder\Data\UpdateWorkOrderData;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;

class UpdateWorkOrderAction
{
    public function __construct(
        private readonly WorkOrderRepositoryInterface $workOrders,
        private readonly GetWorkOrderAction $getWorkOrder,
        private readonly ApproveWorkOrderAction $approveWorkOrder,
    ) {}

    public function execute(int $id, UpdateWorkOrderData $data): WorkOrder
    {
        $attributes = $data->toAttributes();

        if (
            isset($attributes['status'])
            && $attributes['status'] === WorkOrderStatus::Approved->value
            && $data->approvedBy !== null
        ) {
            return $this->approveWorkOrder->execute($id, $data->approvedBy);
        }

        $workOrder = $this->getWorkOrder->execute($id);

        return $this->workOrders->update($workOrder, $attributes);
    }
}
