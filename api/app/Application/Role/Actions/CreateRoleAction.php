<?php

declare(strict_types=1);

namespace App\Application\Role\Actions;

use App\Application\Contracts\Repositories\RoleRepositoryInterface;
use App\Application\Role\Data\CreateRoleData;
use App\Application\Role\Services\RoleSlugGenerator;
use App\Application\Role\Services\SyncRolePermissions;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Facades\DB;

class CreateRoleAction
{
    public function __construct(
        private readonly RoleRepositoryInterface $roles,
        private readonly RoleSlugGenerator $slugGenerator,
        private readonly SyncRolePermissions $syncPermissions,
    ) {}

    public function execute(CreateRoleData $data): Role
    {
        return DB::transaction(function () use ($data): Role {
            $slug = $this->slugGenerator->generate($data->name, $data->slug);

            $role = $this->roles->create([
                'slug' => $slug,
                'name' => $data->name,
                'name_ar' => $data->nameAr,
                'is_system' => false,
            ]);

            $this->syncPermissions->sync($role, $data->permissions);

            return $role->load('permissions')->loadCount('users');
        });
    }
}
