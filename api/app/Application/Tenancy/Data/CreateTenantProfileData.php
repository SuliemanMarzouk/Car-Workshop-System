<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Data;

use App\Domain\Setting\Enums\SettingKey;

readonly class CreateTenantProfileData
{
    public function __construct(
        public string $workshopName,
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
        public ?string $logoDataUrl = null,
    ) {}

    /** @return array<string, mixed> */
    public function toInitialSettingsArray(): array
    {
        return [
            SettingKey::WorkshopName->value => $this->workshopName,
            SettingKey::LogoDataUrl->value => $this->logoDataUrl,
            SettingKey::Address->value => $this->address,
            SettingKey::City->value => $this->city,
            SettingKey::Country->value => $this->country,
            SettingKey::Phone->value => $this->phone,
            SettingKey::Email->value => $this->email,
            SettingKey::TaxNumber->value => $this->taxNumber,
            SettingKey::DefaultCurrency->value => $this->defaultCurrency,
            SettingKey::VatRate->value => $this->vatRate,
            SettingKey::EmailNotifications->value => $this->emailNotifications,
            SettingKey::SmsNotifications->value => $this->smsNotifications,
        ];
    }

    public static function fromValidated(array $validated): self
    {
        return new self(
            workshopName: (string) ($validated['workshop_name'] ?? $validated['name'] ?? ''),
            address: (string) ($validated['address'] ?? ''),
            city: (string) ($validated['city'] ?? ''),
            country: (string) ($validated['country'] ?? ''),
            phone: (string) ($validated['phone'] ?? ''),
            email: (string) ($validated['email'] ?? ''),
            taxNumber: (string) ($validated['tax_number'] ?? ''),
            defaultCurrency: (string) ($validated['default_currency'] ?? 'USD'),
            vatRate: (float) ($validated['vat_rate'] ?? 0.15),
            emailNotifications: (bool) ($validated['email_notifications'] ?? true),
            smsNotifications: (bool) ($validated['sms_notifications'] ?? false),
            logoDataUrl: isset($validated['logo_data_url']) ? (string) $validated['logo_data_url'] : null,
        );
    }
}
