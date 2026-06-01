<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

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
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'work_order_id.unique' => __('This work order already has an invoice.'),
        ];
    }
}
