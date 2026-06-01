<?php

namespace Database\Seeders;

use App\Domain\Authorization\Enums\Permission as PermissionEnum;
use App\Infrastructure\Persistence\Eloquent\Models\Permission;
use App\Infrastructure\Persistence\Eloquent\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissionLabels = [
            PermissionEnum::DashboardView->value => ['Dashboard', 'لوحة التحكم'],
            PermissionEnum::CarsView->value => ['View cars', 'عرض السيارات'],
            PermissionEnum::CarsCreate->value => ['Create cars', 'إضافة سيارات'],
            PermissionEnum::CarsUpdate->value => ['Update cars', 'تعديل السيارات'],
            PermissionEnum::CarsDelete->value => ['Delete cars', 'حذف السيارات'],
            PermissionEnum::WorkOrdersView->value => ['View work orders', 'عرض أوامر العمل'],
            PermissionEnum::WorkOrdersCreate->value => ['Create work orders', 'إنشاء أوامر عمل'],
            PermissionEnum::WorkOrdersUpdate->value => ['Update work orders', 'تعديل أوامر العمل'],
            PermissionEnum::WorkOrdersDelete->value => ['Delete work orders', 'حذف أوامر العمل'],
            PermissionEnum::WorkOrdersApprove->value => ['Approve work orders', 'اعتماد أوامر العمل'],
            PermissionEnum::InvoicesView->value => ['View invoices', 'عرض الفواتير'],
            PermissionEnum::InvoicesCreate->value => ['Create invoices', 'إصدار فواتير'],
            PermissionEnum::UsersView->value => ['View users', 'عرض المستخدمين'],
            PermissionEnum::UsersCreate->value => ['Create users', 'إضافة مستخدمين'],
            PermissionEnum::UsersUpdate->value => ['Update users', 'تعديل المستخدمين'],
            PermissionEnum::UsersDelete->value => ['Delete users', 'حذف المستخدمين'],
            PermissionEnum::SettingsView->value => ['View settings', 'عرض الإعدادات'],
            PermissionEnum::SettingsUpdate->value => ['Update settings', 'تعديل الإعدادات'],
            PermissionEnum::RolesView->value => ['View roles', 'عرض الأدوار'],
            PermissionEnum::RolesCreate->value => ['Create roles', 'إنشاء أدوار'],
            PermissionEnum::RolesUpdate->value => ['Update roles', 'تعديل الأدوار'],
            PermissionEnum::RolesDelete->value => ['Delete roles', 'حذف الأدوار'],
        ];

        foreach ($permissionLabels as $slug => [$name, $nameAr]) {
            Permission::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'name_ar' => $nameAr],
            );
        }

        $permissionsBySlug = Permission::query()->pluck('id', 'slug');

        foreach (config('permissions.roles') as $slug => $roleConfig) {
            $role = Role::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $roleConfig['name'],
                    'name_ar' => $roleConfig['name_ar'],
                    'is_system' => true,
                ],
            );

            $permissionIds = collect($roleConfig['permissions'])
                ->map(fn (string $permSlug) => $permissionsBySlug[$permSlug] ?? null)
                ->filter()
                ->values()
                ->all();

            $role->permissions()->sync($permissionIds);
        }

        $viewerRole = Role::query()->where('slug', 'viewer')->first();
        if ($viewerRole) {
            \App\Infrastructure\Persistence\Eloquent\Models\User::query()
                ->whereNull('role_id')
                ->update(['role_id' => $viewerRole->id]);
        }
    }
}
