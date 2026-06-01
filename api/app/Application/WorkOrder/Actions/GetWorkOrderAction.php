<?php

namespace App\Application\WorkOrder\Actions;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class GetWorkOrderAction
{
    public function __construct(
        private readonly WorkOrderRepositoryInterface $workOrders,
    ) {}

    public function execute(int $id): WorkOrder
    {
        $workOrder = $this->workOrders->findById($id);

        if ($workOrder === null) {
            throw new NotFoundHttpException(__('Work order not found.'));
        }

        return $workOrder->load(['car', 'items', 'invoice']);
    }
}
