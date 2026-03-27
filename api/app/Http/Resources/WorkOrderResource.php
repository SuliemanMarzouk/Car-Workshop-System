<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkOrderResource extends JsonResource
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
            'car' => new CarResource($this->whenLoaded('car')),
            'status' => $this->status,
            'created_by' => $this->creator ? $this->creator->name : null,
            'approved_by' => $this->approver ? $this->approver->name : null,
            'items' => $this->whenLoaded('items'),
            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),
            'created_at' => $this->created_at,
        ];
    }
}
