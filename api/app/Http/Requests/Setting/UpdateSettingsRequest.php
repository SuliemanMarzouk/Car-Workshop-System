<?php

declare(strict_types=1);

namespace App\Http\Requests\Setting;

use App\Domain\Invoice\Enums\InvoiceCurrency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'workshop_name' => 'required|string|max:255',
            'logo_data_url' => 'nullable|string|max:700000',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'tax_number' => 'nullable|string|max:50',
            'default_currency' => ['required', 'string', Rule::in(InvoiceCurrency::values())],
            'vat_rate' => 'required|numeric|min:0|max:1',
            'email_notifications' => 'sometimes|boolean',
            'sms_notifications' => 'sometimes|boolean',
        ];
    }
}
