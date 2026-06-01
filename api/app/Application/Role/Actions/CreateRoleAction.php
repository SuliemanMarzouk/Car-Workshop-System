<?php

namespace App\Application\Role\Actions;

use App\Application\Role\Data\CreateRoleData;
use App\Application\Role\Services\RoleSlugGenerator;
use App\Application\Role\Services\SyncRolePermissions;
use App\Infrastructure\Persistence\Eloquent\Models\Role;

class CreateRoleAction
{
    public function __construct(
        private readonly RoleSlugGenerator $slugGenerator,
        private readonly SyncRolePermissions $syncPermissions,
    ) {}

    public function execute(CreateRoleData $data): Role
    {
        $slug = $this->slugGenerator->generate($data->name, $data->slug);

        $role = Role::query()->create([
            'slug' => $slug,
            'name' => $data->name,
            'name_ar' => $data->nameAr,
            'is_system' => false,
        ]);

        $this->syncPermissions->sync($role, $data->permissions);

        return $role->load('permissions')->loadCount('users');
    }
}
