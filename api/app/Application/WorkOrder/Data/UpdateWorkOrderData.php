<?php

namespace App\Application\WorkOrder\Data;

use App\Domain\WorkOrder\Enums\WorkOrderStatus;

readonly class UpdateWorkOrderData
{
    public function __construct(
        public ?WorkOrderStatus $status = null,
        public ?int $approvedBy = null,
    ) {}

    public static function fromValidated(array $validated, ?int $approvedBy = null): self
    {
        $status = isset($validated['status'])
            ? WorkOrderStatus::from($validated['status'])
            : null;

        return new self(
            status: $status,
            approvedBy: $approvedBy,
        );
    }

    public function toAttributes(): array
    {
        $attributes = [];

        if ($this->status !== null) {
            $attributes['status'] = $this->status->value;
        }

        if ($this->approvedBy !== null) {
            $attributes['approved_by'] = $this->approvedBy;
        }

        return $attributes;
    }
}
