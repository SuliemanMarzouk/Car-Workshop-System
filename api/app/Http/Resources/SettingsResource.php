<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin array<string, mixed> */
class SettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'workshop_name' => $this->resource['workshop_name'] ?? '',
            'logo_data_url' => $this->resource['logo_data_url'] ?? null,
            'address' => $this->resource['address'] ?? '',
            'city' => $this->resource['city'] ?? '',
            'country' => $this->resource['country'] ?? '',
            'phone' => $this->resource['phone'] ?? '',
            'email' => $this->resource['email'] ?? '',
            'tax_number' => $this->resource['tax_number'] ?? '',
            'default_currency' => $this->resource['default_currency'] ?? 'USD',
            'vat_rate' => (float) ($this->resource['vat_rate'] ?? 0.15),
            'email_notifications' => (bool) ($this->resource['email_notifications'] ?? true),
            'sms_notifications' => (bool) ($this->resource['sms_notifications'] ?? false),
        ];
    }
}
