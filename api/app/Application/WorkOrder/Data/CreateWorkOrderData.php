<?php

namespace App\Application\WorkOrder\Data;

readonly class CreateWorkOrderData
{
    /**
     * @param  list<WorkOrderItemData>  $items
     */
    public function __construct(
        public int $carId,
        public array $items,
        public int $createdBy,
    ) {}

    public static function fromValidated(array $validated, int $createdBy): self
    {
        $items = array_map(
            fn (array $item) => new WorkOrderItemData(
                description: $item['description'],
                price: isset($item['price']) ? (float) $item['price'] : null,
            ),
            $validated['items'],
        );

        return new self(
            carId: (int) $validated['car_id'],
            items: $items,
            createdBy: $createdBy,
        );
    }
}
