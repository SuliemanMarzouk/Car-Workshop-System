<?php

namespace App\Application\User\Actions;

use App\Domain\Authorization\Enums\RoleSlug;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Validation\ValidationException;

class DeleteUserAction
{
    public function execute(int $userId, User $actor): void
    {
        if ($userId === $actor->id) {
            throw ValidationException::withMessages([
                'user' => [__('users.cannot_delete_self')],
            ]);
        }

        $user = User::query()->with('role')->findOrFail($userId);

        if ($user->role?->slug === RoleSlug::OrganizationAdmin->value) {
            $adminCount = User::query()
                ->whereHas('role', fn ($q) => $q->where('slug', RoleSlug::OrganizationAdmin->value))
                ->count();

            if ($adminCount <= 1) {
                throw ValidationException::withMessages([
                    'user' => [__('users.cannot_delete_last_admin')],
                ]);
            }
        }

        $user->tokens()->delete();
        $user->delete();
    }
}
