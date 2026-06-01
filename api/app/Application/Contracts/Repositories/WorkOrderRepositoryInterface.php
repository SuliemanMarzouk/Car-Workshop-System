<?php

namespace App\Application\Contracts\Repositories;

use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WorkOrderRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?WorkOrder;

    public function create(array $attributes, array $items): WorkOrder;

    public function update(WorkOrder $workOrder, array $attributes): WorkOrder;

    public function delete(WorkOrder $workOrder): void;
}
