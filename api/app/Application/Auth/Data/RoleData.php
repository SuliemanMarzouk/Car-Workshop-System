<?php

namespace App\Application\Auth\Data;

readonly class RoleData
{
    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public string $name_ar,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
        ];
    }
}
