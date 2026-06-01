<?php

namespace App\Infrastructure\Authorization\Concerns;

use App\Application\Authorization\Services\ResolveUserPermissions;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasPermissions
{
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermission(string $permission): bool
    {
        return app(ResolveUserPermissions::class)->has($this, $permission);
    }

    /** @return list<string> */
    public function permissionSlugs(): array
    {
        return app(ResolveUserPermissions::class)->slugsFor($this);
    }
}
