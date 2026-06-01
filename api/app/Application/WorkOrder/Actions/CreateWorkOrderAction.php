<?php

namespace App\Application\WorkOrder\Actions;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Application\WorkOrder\Data\CreateWorkOrderData;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;

class CreateWorkOrderAction
{
    public function __construct(
        private readonly WorkOrderRepositoryInterface $workOrders,
    ) {}

    public function execute(CreateWorkOrderData $data): WorkOrder
    {
        return $this->workOrders->create(
            [
                'car_id' => $data->carId,
                'created_by' => $data->createdBy,
            ],
            $data->items,
        );
    }
}
