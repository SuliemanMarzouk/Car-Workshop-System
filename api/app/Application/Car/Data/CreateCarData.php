<?php

namespace App\Application\Car\Data;

readonly class CreateCarData
{
    public function __construct(
        public string $plateNumber,
        public string $vin,
        public string $carModel,
        public string $color,
        public int $odometer,
        public string $ownerName,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            plateNumber: $validated['plate_number'],
            vin: $validated['vin'],
            carModel: $validated['car_model'],
            color: $validated['color'],
            odometer: (int) $validated['odometer'],
            ownerName: $validated['owner_name'],
        );
    }

    public function toAttributes(): array
    {
        return [
            'plate_number' => $this->plateNumber,
            'vin' => $this->vin,
            'car_model' => $this->carModel,
            'color' => $this->color,
            'odometer' => $this->odometer,
            'owner_name' => $this->ownerName,
        ];
    }
}
