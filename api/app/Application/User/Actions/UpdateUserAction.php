<?php

namespace App\Application\User\Actions;

use App\Application\User\Data\UpdateUserData;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UpdateUserAction
{
    public function execute(int $userId, UpdateUserData $data, User $actor): User
    {
        $user = User::query()->with('role')->findOrFail($userId);

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

        $user->update($payload);

        return $user->fresh(['role']);
    }

    private function isLastOrganizationAdmin(User $user): bool
    {
        if ($user->role?->slug !== RoleSlug::OrganizationAdmin->value) {
            return false;
        }

        return User::query()
            ->whereHas('role', fn ($q) => $q->where('slug', RoleSlug::OrganizationAdmin->value))
            ->count() <= 1;
    }
}
