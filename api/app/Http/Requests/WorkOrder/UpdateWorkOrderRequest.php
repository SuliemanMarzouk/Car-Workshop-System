<?php

namespace App\Http\Requests\WorkOrder;

use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWorkOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(WorkOrderStatus::values())],
        ];
    }
}
