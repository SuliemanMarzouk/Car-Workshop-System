<?php

namespace Tests\Feature;

use App\Application\Setting\Actions\UpdateSettingsAction;
use App\Application\Setting\Data\UpdateSettingsData;
use App\Domain\Authorization\Enums\Permission;
use App\Domain\Authorization\Enums\RoleSlug;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Domain\WorkOrder\Events\WorkOrderApproved;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SettingsAndInvoiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            \Database\Seeders\RolesAndPermissionsSeeder::class,
            \Database\Seeders\SettingsSeeder::class,
        ]);
    }

    public function test_update_settings_action_persists_values(): void
    {
        $action = app(UpdateSettingsAction::class);

        $settings = $action->execute(new UpdateSettingsData(
            workshopName: 'Test Workshop',
            logoDataUrl: null,
            address: 'Street 1',
            city: 'Jeddah',
            country: 'Saudi Arabia',
            phone: '+966500000000',
            email: 'workshop@test.local',
            taxNumber: '1234567890',
            defaultCurrency: 'SAR',
            vatRate: 0.15,
            emailNotifications: true,
            smsNotifications: false,
        ));

        $this->assertSame('Test Workshop', $settings['workshop_name']);
        $this->assertSame('SAR', $settings['default_currency']);
        $this->assertSame(0.15, (float) $settings['vat_rate']);
    }

    public function test_settings_routes_enforce_permissions(): void
    {
        $viewerRole = Role::query()->where('slug', RoleSlug::Viewer->value)->firstOrFail();
        $viewer = User::factory()->create(['role_id' => $viewerRole->id]);

        $this->actingAs($viewer, 'sanctum')
            ->getJson('/api/v1/settings')
            ->assertForbidden();

        $this->actingAs($viewer, 'sanctum')
            ->putJson('/api/v1/settings', ['workshop_name' => 'Hack'])
            ->assertForbidden();

        $adminRole = Role::query()->where('slug', RoleSlug::OrganizationAdmin->value)->firstOrFail();
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/settings')
            ->assertOk()
            ->assertJsonPath('workshop_name', 'Car Service Center');
    }

    public function test_create_invoice_fails_for_non_approved_work_order(): void
    {
        $user = $this->createUserWithPermission(Permission::InvoicesCreate);

        $workOrder = WorkOrder::factory()->create([
            'status' => WorkOrderStatus::Pending->value,
            'created_by' => $user->id,
        ]);

        WorkOrderItem::query()->create([
            'work_order_id' => $workOrder->id,
            'description' => 'Oil change',
            'price' => 100,
            'status' => 'approved',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/invoices', $this->invoicePayload($workOrder->id))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['work_order_id']);
    }

    public function test_create_invoice_succeeds_with_dynamic_vat(): void
    {
        app(UpdateSettingsAction::class)->execute(new UpdateSettingsData(
            workshopName: 'Car Service Center',
            logoDataUrl: null,
            address: '',
            city: 'Riyadh',
            country: 'Saudi Arabia',
            phone: '',
            email: '',
            taxNumber: '',
            defaultCurrency: 'USD',
            vatRate: 0.20,
            emailNotifications: true,
            smsNotifications: false,
        ));

        $user = $this->createUserWithPermission(Permission::InvoicesCreate);

        $workOrder = WorkOrder::factory()->approved($user->id)->create([
            'created_by' => $user->id,
        ]);

        WorkOrderItem::query()->create([
            'work_order_id' => $workOrder->id,
            'description' => 'Brake pads',
            'price' => 100,
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/invoices', $this->invoicePayload($workOrder->id));

        $response->assertCreated()
            ->assertJsonPath('tax', '20.00')
            ->assertJsonPath('total', '120.00')
            ->assertJsonPath('base_currency', 'USD');

        $this->assertDatabaseCount('invoices', 1);
        $this->assertDatabaseHas('work_orders', [
            'id' => $workOrder->id,
            'status' => WorkOrderStatus::Completed->value,
        ]);
    }

    public function test_create_invoice_rejects_duplicate_for_same_work_order(): void
    {
        $user = $this->createUserWithPermission(Permission::InvoicesCreate);

        $workOrder = WorkOrder::factory()->approved($user->id)->create([
            'created_by' => $user->id,
        ]);

        WorkOrderItem::query()->create([
            'work_order_id' => $workOrder->id,
            'description' => 'Filter',
            'price'  => 50,
            'status' => 'approved',
        ]);

        $payload = $this->invoicePayload($workOrder->id);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/invoices', $payload)
            ->assertCreated();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/invoices', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['work_order_id']);
    }

    public function test_work_order_approved_event_is_dispatched(): void
    {
        Event::fake([WorkOrderApproved::class]);

        $adminRole = Role::query()->where('slug', RoleSlug::OrganizationAdmin->value)->firstOrFail();
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        $workOrder = WorkOrder::factory()->create([
            'status' => WorkOrderStatus::Pending->value,
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/work-orders/{$workOrder->id}", [
                'status' => WorkOrderStatus::Approved->value,
            ])
            ->assertOk();

        Event::assertDispatched(WorkOrderApproved::class, function (WorkOrderApproved $event) use ($workOrder, $admin): bool {
            return $event->workOrder->id === $workOrder->id
                && $event->approvedBy === $admin->id;
        });
    }

    /** @return array<string, mixed> */
    private function invoicePayload(int $workOrderId): array
    {
        return [
            'work_order_id' => $workOrderId,
            'bill_to_name' => 'Customer Name',
            'bill_to_address' => 'Address',
            'discount_type' => 'amount',
            'discount_value' => 0,
            'currency' => 'USD',
            'base_currency' => 'USD',
            'exchange_rate' => 1,
        ];
    }

    private function createUserWithPermission(Permission $permission): User
    {
        $role = Role::query()->whereHas(
            'permissions',
            fn ($query) => $query->where('slug', $permission->value),
        )->firstOrFail();

        return User::factory()->create([
            'password' => Hash::make('password'),
            'role_id' => $role->id,
        ]);
    }
}
