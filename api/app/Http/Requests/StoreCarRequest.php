<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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
