<?php

namespace App\Application\Contracts\Repositories;

use App\Infrastructure\Persistence\Eloquent\Models\Car;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CarRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?Car;

    public function create(array $attributes): Car;

    public function update(Car $car, array $attributes): Car;

    public function delete(Car $car): void;
}
