<?php

declare(strict_types=1);

namespace App\Application\Setting\Data;

readonly class UpdateSettingsData
{
    public function __construct(
        public string $workshopName,
        public ?string $logoDataUrl,
        public string $address,
        public string $city,
        public string $country,
        public string $phone,
        public string $email,
        public string $taxNumber,
        public string $defaultCurrency,
        public float $vatRate,
        public bool $emailNotifications,
        public bool $smsNotifications,
    ) {}

    /** @return array<string, mixed> */
    public function toKeyValueArray(): array
    {
        return [
            'workshop_name' => $this->workshopName,
            'logo_data_url' => $this->logoDataUrl,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'phone' => $this->phone,
            'email' => $this->email,
            'tax_number' => $this->taxNumber,
            'default_currency' => $this->defaultCurrency,
            'vat_rate' => $this->vatRate,
            'email_notifications' => $this->emailNotifications,
            'sms_notifications' => $this->smsNotifications,
        ];
    }

    public static function fromValidated(array $validated): self
    {
        return new self(
            workshopName: $validated['workshop_name'],
            logoDataUrl: $validated['logo_data_url'] ?? null,
            address: $validated['address'] ?? '',
            city: $validated['city'] ?? '',
            country: $validated['country'] ?? '',
            phone: $validated['phone'] ?? '',
            email: $validated['email'] ?? '',
            taxNumber: $validated['tax_number'] ?? '',
            defaultCurrency: $validated['default_currency'],
            vatRate: (float) $validated['vat_rate'],
            emailNotifications: (bool) ($validated['email_notifications'] ?? true),
            smsNotifications: (bool) ($validated['sms_notifications'] ?? false),
        );
    }
}
