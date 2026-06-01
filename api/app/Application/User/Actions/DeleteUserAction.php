<?php

declare(strict_types=1);

namespace App\Application\User\Actions;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Validation\ValidationException;

class DeleteUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(int $userId, User $actor): void
    {
        if ($userId === $actor->id) {
            throw ValidationException::withMessages([
                'user' => [__('users.cannot_delete_self')],
            ]);
        }

        $user = $this->users->findByIdOrFail($userId);
        $user->load('role');

        if ($user->role?->slug === RoleSlug::OrganizationAdmin->value) {
            if ($this->users->countByRoleSlug(RoleSlug::OrganizationAdmin->value) <= 1) {
                throw ValidationException::withMessages([
                    'user' => [__('users.cannot_delete_last_admin')],
                ]);
            }
        }

        $this->users->delete($user);
    }
}
