<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Domain\Setting\Enums\SettingKey;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        /** @var SettingRepositoryInterface $settings */
        $settings = app(SettingRepositoryInterface::class);

        $settings->setMany([
            SettingKey::WorkshopName->value => 'Car Service Center',
            SettingKey::DefaultCurrency->value => 'USD',
            SettingKey::VatRate->value => 0.15,
            SettingKey::City->value => 'Riyadh',
            SettingKey::Country->value => 'Saudi Arabia',
            SettingKey::EmailNotifications->value => true,
            SettingKey::SmsNotifications->value => false,
        ]);
    }
}
