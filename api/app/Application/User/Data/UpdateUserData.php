<?php

namespace App\Application\User\Data;

readonly class UpdateUserData
{
    public function __construct(
        public string $name,
        public string $email,
        public int $roleId,
        public ?string $password,
    ) {}

    /** @param array<string, mixed> $validated */
    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            email: $validated['email'],
            roleId: (int) $validated['role_id'],
            password: $validated['password'] ?? null,
        );
    }
}
