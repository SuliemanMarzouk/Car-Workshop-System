<?php

namespace App\Application\Role\Data;

readonly class UpdateRoleData
{
    /**
     * @param  list<string>  $permissions
     */
    public function __construct(
        public string $name,
        public string $nameAr,
        public ?string $slug,
        public array $permissions,
    ) {}

    /** @param array<string, mixed> $validated */
    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            nameAr: $validated['name_ar'],
            slug: $validated['slug'] ?? null,
            permissions: $validated['permissions'] ?? [],
        );
    }
}
