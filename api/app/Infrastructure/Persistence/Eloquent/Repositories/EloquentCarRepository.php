<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Application\Contracts\Repositories\CarRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Car;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCarRepository implements CarRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Car::query()->latest()->paginate($perPage);
    }

    public function findById(int $id): ?Car
    {
        return Car::query()->find($id);
    }

    public function create(array $attributes): Car
    {
        return Car::query()->create($attributes);
    }

    public function update(Car $car, array $attributes): Car
    {
        $car->update($attributes);

        return $car->fresh();
    }

    public function delete(Car $car): void
    {
        $car->delete();
    }
}
