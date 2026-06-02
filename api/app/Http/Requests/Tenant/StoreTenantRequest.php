<?php

declare(strict_types=1);

namespace App\Http\Requests\Tenant;

use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'string', 'max:63', 'regex:/^[a-z0-9][a-z0-9_-]*$/i', Rule::unique(Tenant::class, 'id')],
            'domain' => ['nullable', 'string', 'max:255'],
            'workshop_name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'tax_number' => ['nullable', 'string', 'max:80'],
            'default_currency' => ['required', 'string', Rule::in(['USD', 'SAR'])],
            'vat_rate' => ['required', 'numeric', 'min:0', 'max:1'],
            'email_notifications' => ['sometimes', 'boolean'],
            'sms_notifications' => ['sometimes', 'boolean'],
            'logo_data_url' => ['nullable', 'string', 'max:500000'],
        ];
    }
}
