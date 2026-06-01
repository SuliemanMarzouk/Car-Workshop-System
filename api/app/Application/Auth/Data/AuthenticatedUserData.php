<?php

namespace App\Application\Auth\Data;

use App\Application\Authorization\Services\ResolveUserPermissions;
use App\Infrastructure\Persistence\Eloquent\Models\User;

readonly class AuthenticatedUserData
{
    /**
     * @param  list<string>  $permissions
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?RoleData $role,
        public array $permissions,
    ) {}

    public static function fromUser(User $user, ResolveUserPermissions $resolver): self
    {
        $user->loadMissing('role');

        $role = $user->role
            ? new RoleData(
                id: $user->role->id,
                slug: $user->role->slug,
                name: $user->role->name,
                name_ar: $user->role->name_ar,
            )
            : null;

        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            role: $role,
            permissions: $resolver->slugsFor($user),
        );
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role?->toArray(),
            'permissions' => $this->permissions,
        ];
    }
}
