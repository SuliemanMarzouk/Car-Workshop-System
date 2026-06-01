<?php

declare(strict_types=1);

namespace App\Application\User\Actions;

use App\Application\Contracts\Repositories\UserRepositoryInterface;
use App\Application\User\Data\UpdateUserData;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UpdateUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(int $userId, UpdateUserData $data, User $actor): User
    {
        $user = $this->users->findByIdOrFail($userId);
        $user->load('role');

        if ($user->id === $actor->id && $data->roleId !== (int) $user->role_id) {
            throw ValidationException::withMessages([
                'role_id' => [__('users.cannot_change_own_role')],
            ]);
        }

        if ($this->isLastOrganizationAdmin($user) && $data->roleId !== $user->role_id) {
            throw ValidationException::withMessages([
                'role_id' => [__('users.cannot_demote_last_admin')],
            ]);
        }

        $payload = [
            'name' => $data->name,
            'email' => $data->email,
            'role_id' => $data->roleId,
        ];

        if ($data->password) {
            $payload['password'] = Hash::make($data->password);
        }

        return $this->users->update($user, $payload);
    }

    private function isLastOrganizationAdmin(User $user): bool
    {
        if ($user->role?->slug !== RoleSlug::OrganizationAdmin->value) {
            return false;
        }

        return $this->users->countByRoleSlug(RoleSlug::OrganizationAdmin->value) <= 1;
    }
}
