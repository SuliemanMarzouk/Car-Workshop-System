<?php

namespace App\Application\Role\Services;

use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Support\Str;

final class RoleSlugGenerator
{
    public function generate(string $name, ?string $preferred = null, ?int $ignoreRoleId = null): string
    {
        $base = Str::slug($preferred ?: $name);

        if ($base === '') {
            $base = 'role';
        }

        $slug = $base;
        $suffix = 1;

        while ($this->slugExists($slug, $ignoreRoleId)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function slugExists(string $slug, ?int $ignoreRoleId): bool
    {
        return Role::query()
            ->when($ignoreRoleId, fn ($q) => $q->where('id', '!=', $ignoreRoleId))
            ->where('slug', $slug)
            ->exists();
    }
}
