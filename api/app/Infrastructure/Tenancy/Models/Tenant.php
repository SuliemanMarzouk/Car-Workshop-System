<?php

declare(strict_types=1);

namespace App\Infrastructure\Tenancy\Models;

use App\Domain\Tenancy\Enums\TenantStatus;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase;
    use HasDomains;

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'status',
        ];
    }

    /** @var list<string> */
    protected $fillable = [
        'id',
        'name',
        'status',
        'data',
    ];

    protected function casts(): array
    {
        return array_merge(parent::casts() ?? [], [
            'status' => TenantStatus::class,
        ]);
    }

    public function displayName(): string
    {
        $name = trim((string) ($this->name ?? ''));

        return $name !== '' ? $name : (string) $this->id;
    }
}

