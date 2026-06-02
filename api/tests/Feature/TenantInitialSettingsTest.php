<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Application\Tenancy\Actions\CreateTenantAction;
use App\Application\Tenancy\Data\CreateTenantProfileData;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class TenantInitialSettingsTest extends TestCase
{
    public function test_tenant_creation_applies_initial_settings_from_provisioning_profile(): void
    {
        Artisan::call('migrate:fresh', ['--database' => 'central']);

        $tenantId = 'settings_' . bin2hex(random_bytes(3));
        $profile = new CreateTenantProfileData(
            workshopName: 'My Custom Workshop',
            address: 'Street 1',
            city: 'Jeddah',
            country: 'SA',
            phone: '+966111',
            email: 'custom@test.com',
            taxNumber: 'TAX123',
            defaultCurrency: 'SAR',
            vatRate: 0.05,
            emailNotifications: false,
            smsNotifications: true,
        );

        app(CreateTenantAction::class)->execute($tenantId, $profile, "{$tenantId}.localhost");

        $tenant = Tenant::query()->findOrFail($tenantId);

        tenancy()->initialize($tenant);

        try {
            $settings = app(SettingRepositoryInterface::class)->all();

            $this->assertSame('My Custom Workshop', $settings['workshop_name']);
            $this->assertSame('Jeddah', $settings['city']);
            $this->assertSame('SAR', $settings['default_currency']);
            $this->assertSame(0.05, $settings['vat_rate']);
            $this->assertFalse($settings['email_notifications']);
            $this->assertTrue($settings['sms_notifications']);
        } finally {
            tenancy()->end();
            $tenant->delete();
        }
    }
}
