<?php

namespace App\Application\Car\Data;

readonly class UpdateCarData
{
    public function __construct(
        public ?string $plateNumber = null,
        public ?string $vin = null,
        public ?string $carModel = null,
        public ?string $color = null,
        public ?int $odometer = null,
        public ?string $ownerName = null,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            plateNumber: $validated['plate_number'] ?? null,
            vin: $validated['vin'] ?? null,
            carModel: $validated['car_model'] ?? null,
            color: $validated['color'] ?? null,
            odometer: isset($validated['odometer']) ? (int) $validated['odometer'] : null,
            ownerName: $validated['owner_name'] ?? null,
        );
    }

    public function toAttributes(): array
    {
        return array_filter([
            'plate_number' => $this->plateNumber,
            'vin' => $this->vin,
            'car_model' => $this->carModel,
            'color' => $this->color,
            'odometer' => $this->odometer,
            'owner_name' => $this->ownerName,
        ], fn ($value) => $value !== null);
    }
}
