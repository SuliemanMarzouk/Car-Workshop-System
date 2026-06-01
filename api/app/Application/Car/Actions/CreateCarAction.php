<?php

namespace App\Application\Car\Actions;

use App\Application\Car\Data\CreateCarData;
use App\Application\Contracts\Repositories\CarRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Car;

class CreateCarAction
{
    public function __construct(
        private readonly CarRepositoryInterface $cars,
    ) {}

    public function execute(CreateCarData $data): Car
    {
        return $this->cars->create($data->toAttributes());
    }
}
