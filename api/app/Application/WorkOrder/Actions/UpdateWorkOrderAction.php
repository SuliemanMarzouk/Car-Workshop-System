<?php

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
    ) {}

    public function execute(int $id, UpdateWorkOrderData $data): WorkOrder
    {
        $workOrder = $this->getWorkOrder->execute($id);
        $attributes = $data->toAttributes();

        if (
            isset($attributes['status'])
            && $attributes['status'] === WorkOrderStatus::Approved->value
            && $data->approvedBy !== null
        ) {
            $attributes['approved_by'] = $data->approvedBy;
        }

        return $this->workOrders->update($workOrder, $attributes);
    }
}
