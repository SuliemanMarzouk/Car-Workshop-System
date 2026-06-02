<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class CentralProvisioningTest extends TestCase
{
    public function test_central_provisioning_requires_token(): void
    {
        Artisan::call('migrate:fresh', ['--database' => 'central']);

        $this->postJson('/api/v1/central/tenants', ['id' => 'workshopx'])
            ->assertForbidden();
    }

    public function test_central_provisioning_creates_tenant_and_allows_login_with_x_tenant_header(): void
    {
        Artisan::call('migrate:fresh', ['--database' => 'central']);

        config()->set('tenancy.central_provisioning_token', 'test-token');

        $tenantId = 'workshop_' . bin2hex(random_bytes(4));

        $this
            ->withHeader('X-Central-Token', 'test-token')
            ->postJson('/api/v1/central/tenants', [
                'id' => $tenantId,
                'domain' => "{$tenantId}.localhost",
            ])
            ->assertCreated()
            ->assertJsonPath('id', $tenantId);

        $this
            ->withHeader('X-Tenant', $tenantId)
            ->postJson('/api/v1/login', [
                'email' => 'admin@workshop.local',
                'password' => 'password',
            ])
            ->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }
}

