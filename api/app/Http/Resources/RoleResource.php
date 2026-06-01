<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'is_system' => (bool) $this->is_system,
            'users_count' => $this->whenCounted('users'),
            'permissions' => $this->whenLoaded(
                'permissions',
                fn () => $this->permissions->pluck('slug')->values()->all(),
            ),
        ];
    }
}
