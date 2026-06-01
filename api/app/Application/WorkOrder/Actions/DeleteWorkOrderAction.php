<?php

namespace App\Application\WorkOrder\Actions;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;

class DeleteWorkOrderAction
{
    public function __construct(
        private readonly WorkOrderRepositoryInterface $workOrders,
        private readonly GetWorkOrderAction $getWorkOrder,
    ) {}

    public function execute(int $id): void
    {
        $workOrder = $this->getWorkOrder->execute($id);
        $this->workOrders->delete($workOrder);
    }
}
