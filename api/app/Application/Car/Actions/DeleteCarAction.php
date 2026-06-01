<?php

namespace App\Application\Car\Actions;

use App\Application\Contracts\Repositories\CarRepositoryInterface;

class DeleteCarAction
{
    public function __construct(
        private readonly CarRepositoryInterface $cars,
        private readonly GetCarAction $getCar,
    ) {}

    public function execute(int $id): void
    {
        $car = $this->getCar->execute($id);
        $this->cars->delete($car);
    }
}
