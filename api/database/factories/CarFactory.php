<?php

namespace Database\Factories;

use App\Infrastructure\Persistence\Eloquent\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Car> */
class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        return [
            'plate_number' => strtoupper(fake()->bothify('???-####')),
            'vin' => strtoupper(fake()->bothify('1HGBH41JXMN######')),
            'car_model' => fake()->words(2, true),
            'color' => fake()->safeColorName(),
            'odometer' => fake()->numberBetween(1000, 200000),
            'owner_name' => fake()->name(),
        ];
    }
}
