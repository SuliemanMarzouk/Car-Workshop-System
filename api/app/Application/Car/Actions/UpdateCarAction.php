<?php

namespace App\Application\Car\Actions;

use App\Application\Car\Data\UpdateCarData;
use App\Application\Contracts\Repositories\CarRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Car;

class UpdateCarAction
{
    public function __construct(
        private readonly CarRepositoryInterface $cars,
        private readonly GetCarAction $getCar,
    ) {}

    public function execute(int $id, UpdateCarData $data): Car
    {
        $car = $this->getCar->execute($id);

        return $this->cars->update($car, $data->toAttributes());
    }
}
