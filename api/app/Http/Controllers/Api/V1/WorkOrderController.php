<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\WorkOrder\Actions\CreateWorkOrderAction;
use App\Application\WorkOrder\Actions\DeleteWorkOrderAction;
use App\Application\WorkOrder\Actions\GetWorkOrderAction;
use App\Application\WorkOrder\Actions\ListWorkOrdersAction;
use App\Application\WorkOrder\Actions\UpdateWorkOrderAction;
use App\Application\WorkOrder\Data\CreateWorkOrderData;
use App\Application\WorkOrder\Data\UpdateWorkOrderData;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\WorkOrder\StoreWorkOrderRequest;
use App\Http\Requests\WorkOrder\UpdateWorkOrderRequest;
use App\Http\Resources\WorkOrderResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WorkOrderController extends Controller
{
    public function index(ListWorkOrdersAction $action): AnonymousResourceCollection
    {
        return WorkOrderResource::collection($action->execute());
    }

    public function store(StoreWorkOrderRequest $request, CreateWorkOrderAction $action): WorkOrderResource
    {
        $createdBy = $request->user()?->id ?? 1;

        $workOrder = $action->execute(
            CreateWorkOrderData::fromValidated($request->validated(), $createdBy),
        );

        return new WorkOrderResource($workOrder);
    }

    public function show(int $work_order, GetWorkOrderAction $action): WorkOrderResource
    {
        return new WorkOrderResource($action->execute($work_order));
    }

    public function update(
        UpdateWorkOrderRequest $request,
        int $work_order,
        UpdateWorkOrderAction $action,
    ): WorkOrderResource {
        $approvedBy = null;
        $status = $request->validated()['status'] ?? null;

        if ($status === WorkOrderStatus::Approved->value) {
            $approvedBy = $request->user()?->id;
        }

        $updated = $action->execute(
            $work_order,
            UpdateWorkOrderData::fromValidated($request->validated(), $approvedBy),
        );

        return new WorkOrderResource($updated);
    }

    public function destroy(int $work_order, DeleteWorkOrderAction $action): JsonResponse
    {
        $action->execute($work_order);

        return response()->json(null, 204);
    }
}
