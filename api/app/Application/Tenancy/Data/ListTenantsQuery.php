<?php

declare(strict_types=1);

namespace App\Application\Tenancy\Data;

readonly class ListTenantsQuery
{
    public function __construct(
        public int $page = 1,
        public int $perPage = 15,
        public ?string $search = null,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            page: max(1, (int) ($validated['page'] ?? 1)),
            perPage: min(100, max(1, (int) ($validated['per_page'] ?? 15))),
            search: isset($validated['search']) && $validated['search'] !== ''
                ? (string) $validated['search']
                : null,
        );
    }
}
