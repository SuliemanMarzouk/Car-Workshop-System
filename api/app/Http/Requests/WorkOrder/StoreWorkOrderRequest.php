<?php

namespace App\Http\Requests\WorkOrder;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'car_id' => 'required|exists:cars,id',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.price' => 'nullable|numeric',
        ];
    }
}
