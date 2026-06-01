<?php

namespace App\Application\Car\Actions;

use App\Application\Contracts\Repositories\CarRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListCarsAction
{
    public function __construct(
        private readonly CarRepositoryInterface $cars,
    ) {}

    public function execute(int $perPage = 10): LengthAwarePaginator
    {
        return $this->cars->paginate($perPage);
    }
}
