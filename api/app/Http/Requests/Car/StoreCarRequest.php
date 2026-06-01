<?php

namespace App\Http\Requests\Car;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plate_number' => 'required|string|unique:cars,plate_number',
            'vin' => 'required|string|unique:cars,vin',
            'car_model' => 'required|string',
            'color' => 'required|string',
            'odometer' => 'required|integer',
            'owner_name' => 'required|string',
        ];
    }
}
