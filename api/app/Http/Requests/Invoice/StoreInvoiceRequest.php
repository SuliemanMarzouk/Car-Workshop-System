<?php

namespace App\Http\Requests\Invoice;

use App\Domain\Invoice\Enums\InvoiceCurrency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'work_order_id' => 'required|integer|exists:work_orders,id|unique:invoices,work_order_id',
            'bill_to_name' => 'required|string|max:255',
            'bill_to_address' => 'nullable|string|max:1000',
            'discount_type' => 'nullable|string|in:amount,percent',
            'discount_value' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'currency' => ['required', 'string', Rule::in(InvoiceCurrency::values())],
            'base_currency' => ['required', 'string', Rule::in(InvoiceCurrency::values())],
            'exchange_rate' => 'required|numeric|min:0.000001|max:999999',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $type = $this->input('discount_type', 'amount');
            $value = (float) $this->input('discount_value', 0);

            if ($type === 'percent' && $value > 100) {
                $validator->errors()->add(
                    'discount_value',
                    __('Percentage discount cannot exceed 100%.'),
                );
            }

            $currency = $this->input('currency');
            $baseCurrency = $this->input('base_currency');
            $rate = (float) $this->input('exchange_rate', 1);

            if ($currency === $baseCurrency && abs($rate - 1) > 0.0001) {
                $validator->errors()->add(
                    'exchange_rate',
                    __('Exchange rate must be 1 when invoice currency matches base currency.'),
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'work_order_id.unique' => __('This work order already has an invoice.'),
        ];
    }
}
