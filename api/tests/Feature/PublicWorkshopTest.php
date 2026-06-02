<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Domain\Tenancy\Enums\TenantStatus;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class PublicWorkshopTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('migrate:fresh', ['--database' => 'central']);
    }

    public function test_unknown_workshop_returns_404(): void
    {
        $this->getJson('/api/v1/public/workshops/unknown_shop')
            ->assertNotFound()
            ->assertJsonPath('exists', false);
    }

    public function test_suspended_workshop_returns_403(): void
    {
        Tenant::withoutEvents(function (): void {
            Tenant::create([
                'id' => 'frozen_shop',
                'name' => 'Frozen',
                'status' => TenantStatus::Suspended,
            ]);
        });

        $this->getJson('/api/v1/public/workshops/frozen_shop')
            ->assertForbidden()
            ->assertJsonPath('accessible', false);
    }
}
