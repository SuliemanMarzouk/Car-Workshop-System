<?php

declare(strict_types=1);

namespace App\Application\Contracts\Repositories;

interface SettingRepositoryInterface
{
    /** @return array<string, mixed> */
    public function all(): array;

    public function get(string $key, mixed $default = null): mixed;

    /** @param array<string, mixed> $settings */
    public function setMany(array $settings): void;

    public function vatRate(): float;

    public function defaultCurrency(): string;
}
