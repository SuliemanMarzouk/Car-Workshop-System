<?php

declare(strict_types=1);

namespace App\Application\Setting\Actions;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Domain\Setting\Enums\SettingKey;

class GetWorkshopConfigAction
{
    public function __construct(
        private readonly SettingRepositoryInterface $settings,
    ) {}

    /** @return array<string, mixed> */
    public function execute(): array
    {
        $all = $this->settings->all();

        return [
            'workshop_name' => $all[SettingKey::WorkshopName->value] ?? '',
            'logo_data_url' => $all[SettingKey::LogoDataUrl->value] ?? null,
            'address' => $all[SettingKey::Address->value] ?? '',
            'city' => $all[SettingKey::City->value] ?? '',
            'country' => $all[SettingKey::Country->value] ?? '',
            'phone' => $all[SettingKey::Phone->value] ?? '',
            'email' => $all[SettingKey::Email->value] ?? '',
            'tax_number' => $all[SettingKey::TaxNumber->value] ?? '',
            'default_currency' => $this->settings->defaultCurrency(),
            'vat_rate' => $this->settings->vatRate(),
        ];
    }
}
