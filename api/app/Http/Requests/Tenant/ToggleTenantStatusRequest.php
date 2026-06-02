<?php

declare(strict_types=1);

namespace App\Http\Requests\Tenant;

use App\Domain\Tenancy\Enums\TenantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ToggleTenantStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::enum(TenantStatus::class)],
        ];
    }
}
