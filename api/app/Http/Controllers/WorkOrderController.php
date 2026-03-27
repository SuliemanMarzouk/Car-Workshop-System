<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Http\Resources\WorkOrderResource;
use App\Models\WorkOrder;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workOrders = WorkOrder::with(['car', 'items'])->latest()->paginate(10);
        return WorkOrderResource::collection($workOrders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkOrderRequest $request)
    {
        $workOrder = WorkOrder::create([
            'car_id' => $request->car_id,
            'created_by' => auth()->id() ?? 1,
            'status' => 'pending',
        ]);

        foreach ($request->items as $item) {
            $workOrder->items()->create($item);
        }

        return new WorkOrderResource($workOrder->load(['car', 'items']));
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkOrder $workOrder)
    {
        return new WorkOrderResource($workOrder->load(['car', 'items', 'invoice']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
