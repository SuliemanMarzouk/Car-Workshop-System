<?php

declare(strict_types=1);

namespace App\Application\Setting\Actions;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;

class GetSettingsAction
{
    public function __construct(
        private readonly SettingRepositoryInterface $settings,
    ) {}

    /** @return array<string, mixed> */
    public function execute(): array
    {
        return $this->settings->all();
    }
}
