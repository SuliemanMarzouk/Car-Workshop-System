<?php

declare(strict_types=1);

namespace App\Application\Central\Auth\Data;

readonly class CentralLoginCredentials
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            email: $validated['email'],
            password: $validated['password'],
        );
    }
}
