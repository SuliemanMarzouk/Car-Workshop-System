<?php

declare(strict_types=1);

namespace App\Application\Setting\Actions;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Application\Setting\Data\UpdateSettingsData;

class UpdateSettingsAction
{
    public function __construct(
        private readonly SettingRepositoryInterface $settings,
    ) {}

    /** @return array<string, mixed> */
    public function execute(UpdateSettingsData $data): array
    {
        $this->settings->setMany($data->toKeyValueArray());

        return $this->settings->all();
    }
}
