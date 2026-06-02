<?php

declare(strict_types=1);

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'string', 'max:63', 'regex:/^[a-z0-9][a-z0-9_-]*$/i'],
            'domain' => ['nullable', 'string', 'max:255'],
        ];
    }
}

