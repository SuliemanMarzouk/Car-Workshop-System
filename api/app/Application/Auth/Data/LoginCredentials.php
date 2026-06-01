<?php

namespace App\Application\Auth\Data;

readonly class LoginCredentials
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
