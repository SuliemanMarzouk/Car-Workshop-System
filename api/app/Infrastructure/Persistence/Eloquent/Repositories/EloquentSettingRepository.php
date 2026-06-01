<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Domain\Invoice\Enums\InvoiceCurrency;
use App\Domain\Setting\Enums\SettingKey;
use App\Infrastructure\Persistence\Eloquent\Models\Setting;
use Illuminate\Support\Facades\DB;

class EloquentSettingRepository implements SettingRepositoryInterface
{
    /** @var array<string, mixed>|null */
    private ?array $cache = null;

    public function all(): array
    {
        return $this->loadAll();
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $all = $this->loadAll();

        return $all[$key] ?? $default;
    }

    public function setMany(array $settings): void
    {
        DB::transaction(function () use ($settings): void {
            foreach ($settings as $key => $value) {
                Setting::query()->updateOrCreate(
                    ['key' => $key],
                    ['value' => $this->encodeValue($value)],
                );
            }
        });

        $this->cache = null;
    }

    public function vatRate(): float
    {
        $rate = (float) $this->get(SettingKey::VatRate->value, 0.15);

        return max(min($rate, 1.0), 0.0);
    }

    public function defaultCurrency(): string
    {
        $currency = (string) $this->get(SettingKey::DefaultCurrency->value, InvoiceCurrency::Usd->value);

        return in_array($currency, InvoiceCurrency::values(), true)
            ? $currency
            : InvoiceCurrency::Usd->value;
    }

    /** @return array<string, mixed> */
    private function loadAll(): array
    {
        if ($this->cache !== null) {
            return $this->cache;
        }

        $defaults = $this->defaults();
        $stored = Setting::query()->pluck('value', 'key')->all();

        $merged = [];
        foreach ($defaults as $key => $default) {
            $merged[$key] = array_key_exists($key, $stored)
                ? $this->decodeValue($stored[$key], $default)
                : $default;
        }

        $this->cache = $merged;

        return $merged;
    }

    /** @return array<string, mixed> */
    private function defaults(): array
    {
        return [
            SettingKey::WorkshopName->value => 'Car Service Center',
            SettingKey::LogoDataUrl->value => null,
            SettingKey::Address->value => '',
            SettingKey::City->value => 'Riyadh',
            SettingKey::Country->value => 'Saudi Arabia',
            SettingKey::Phone->value => '',
            SettingKey::Email->value => '',
            SettingKey::TaxNumber->value => '',
            SettingKey::DefaultCurrency->value => InvoiceCurrency::Usd->value,
            SettingKey::VatRate->value => 0.15,
            SettingKey::EmailNotifications->value => true,
            SettingKey::SmsNotifications->value => false,
        ];
    }

    private function encodeValue(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_bool($value)) {
            return json_encode($value);
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        return (string) $value;
    }

    private function decodeValue(?string $raw, mixed $default): mixed
    {
        if ($raw === null) {
            return $default;
        }

        if (is_bool($default)) {
            return filter_var($raw, FILTER_VALIDATE_BOOLEAN);
        }

        if (is_float($default) || is_int($default)) {
            return is_numeric($raw) ? (float) $raw : $default;
        }

        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && $decoded !== null) {
            return $decoded;
        }

        return $raw;
    }
}
