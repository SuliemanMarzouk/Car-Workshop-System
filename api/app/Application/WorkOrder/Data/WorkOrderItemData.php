<?php

namespace App\Application\WorkOrder\Data;

readonly class WorkOrderItemData
{
    public function __construct(
        public string $description,
        public ?float $price = null,
    ) {}

    public function toAttributes(): array
    {
        return [
            'description' => $this->description,
            'price' => $this->price,
        ];
    }
}
