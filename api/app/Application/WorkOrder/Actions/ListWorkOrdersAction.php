<?php

namespace App\Application\WorkOrder\Actions;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListWorkOrdersAction
{
    public function __construct(
        private readonly WorkOrderRepositoryInterface $workOrders,
    ) {}

    public function execute(int $perPage = 10): LengthAwarePaginator
    {
        return $this->workOrders->paginate($perPage);
    }
}
