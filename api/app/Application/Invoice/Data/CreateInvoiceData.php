<?php

namespace App\Application\Invoice\Data;

readonly class CreateInvoiceData
{
    public function __construct(
        public int $workOrderId,
        public string $billToName,
        public ?string $billToAddress,
        public string $discountType,
        public float $discountValue,
        public ?string $notes,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            workOrderId: (int) $validated['work_order_id'],
            billToName: $validated['bill_to_name'],
            billToAddress: $validated['bill_to_address'] ?? null,
            discountType: $validated['discount_type'] ?? 'amount',
            discountValue: (float) ($validated['discount_value'] ?? 0),
            notes: $validated['notes'] ?? null,
        );
    }
}
