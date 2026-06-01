<?php

namespace App\Application\Invoice\Data;

readonly class CreateInvoiceData
{
    public function __construct(
        public int $workOrderId,
        public float $subtotal,
        public float $tax,
        public float $total,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            workOrderId: (int) $validated['work_order_id'],
            subtotal: (float) $validated['subtotal'],
            tax: (float) $validated['tax'],
            total: (float) $validated['total'],
        );
    }

    public function toAttributes(): array
    {
        return [
            'work_order_id' => $this->workOrderId,
            'subtotal' => $this->subtotal,
            'tax' => $this->tax,
            'total' => $this->total,
        ];
    }
}
