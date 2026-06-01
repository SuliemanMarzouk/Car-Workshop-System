<?php

namespace App\Http\Requests\Car;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $carId = $this->route('car');

        return [
            'plate_number' => ['sometimes', 'string', Rule::unique('cars', 'plate_number')->ignore($carId)],
            'vin' => ['sometimes', 'string', Rule::unique('cars', 'vin')->ignore($carId)],
            'car_model' => 'sometimes|string',
            'color' => 'sometimes|string',
            'odometer' => 'sometimes|integer',
            'owner_name' => 'sometimes|string',
        ];
    }
}
