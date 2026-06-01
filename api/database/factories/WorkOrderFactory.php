<?php

namespace Database\Factories;

use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Infrastructure\Persistence\Eloquent\Models\Car;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<WorkOrder> */
class WorkOrderFactory extends Factory
{
    protected $model = WorkOrder::class;

    public function definition(): array
    {
        return [
            'car_id' => Car::factory(),
            'status' => WorkOrderStatus::Pending->value,
            'created_by' => User::factory(),
        ];
    }

    public function approved(?int $approvedBy = null): static
    {
        return $this->state(fn () => [
            'status' => WorkOrderStatus::Approved->value,
            'approved_by' => $approvedBy,
        ]);
    }
}
