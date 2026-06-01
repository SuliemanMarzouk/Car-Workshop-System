<?php

namespace App\Application\Car\Actions;

use App\Application\Contracts\Repositories\CarRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Car;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class GetCarAction
{
    public function __construct(
        private readonly CarRepositoryInterface $cars,
    ) {}

    public function execute(int $id): Car
    {
        $car = $this->cars->findById($id);

        if ($car === null) {
            throw new NotFoundHttpException(__('Car not found.'));
        }

        return $car;
    }
}
