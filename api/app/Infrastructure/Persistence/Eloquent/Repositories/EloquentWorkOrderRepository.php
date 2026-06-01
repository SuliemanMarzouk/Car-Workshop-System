<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Application\Contracts\Repositories\WorkOrderRepositoryInterface;
use App\Application\WorkOrder\Data\WorkOrderItemData;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentWorkOrderRepository implements WorkOrderRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return WorkOrder::query()
            ->with(['car', 'items'])
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): ?WorkOrder
    {
        return WorkOrder::query()->find($id);
    }

    /**
     * @param  list<WorkOrderItemData|array<string, mixed>>  $items
     */
    public function create(array $attributes, array $items): WorkOrder
    {
        return DB::transaction(function () use ($attributes, $items) {
            $workOrder = WorkOrder::query()->create(array_merge($attributes, [
                'status' => WorkOrderStatus::Pending->value,
            ]));

            foreach ($items as $item) {
                $itemAttributes = $item instanceof WorkOrderItemData
                    ? $item->toAttributes()
                    : $item;

                $workOrder->items()->create($itemAttributes);
            }

            return $workOrder->load(['car', 'items']);
        });
    }

    public function update(WorkOrder $workOrder, array $attributes): WorkOrder
    {
        $workOrder->update($attributes);

        return $workOrder->fresh(['car', 'items', 'invoice']);
    }

    public function delete(WorkOrder $workOrder): void
    {
        $workOrder->delete();
    }
}
