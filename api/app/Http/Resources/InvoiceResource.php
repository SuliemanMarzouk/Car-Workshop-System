<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'work_order_id' => $this->work_order_id,
            'bill_to_name' => $this->bill_to_name,
            'bill_to_address' => $this->bill_to_address,
            'discount_type' => $this->discount_type ?? 'amount',
            'discount_value' => $this->discount_value,
            'discount_amount' => $this->discount_amount,
            'subtotal' => $this->subtotal,
            'tax' => $this->tax,
            'total' => $this->total,
            'notes' => $this->notes,
            'work_order' => new WorkOrderResource($this->whenLoaded('workOrder')),
            'created_at' => $this->created_at,
        ];
    }
}
