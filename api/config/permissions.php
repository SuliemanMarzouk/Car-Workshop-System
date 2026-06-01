<?php

use App\Domain\Authorization\Enums\Permission;
use App\Domain\Authorization\Enums\RoleSlug;

return [

    /*
    |--------------------------------------------------------------------------
    | Role → permissions (seeded into DB)
    |--------------------------------------------------------------------------
    */
    'roles' => [
        RoleSlug::OrganizationAdmin->value => [
            'name' => 'Organization Admin',
            'name_ar' => 'مسؤول التنظيم',
            'permissions' => Permission::values(),
        ],
        RoleSlug::WorkshopManager->value => [
            'name' => 'Workshop Manager',
            'name_ar' => 'مدير الورشة',
            'permissions' => [
                Permission::DashboardView->value,
                Permission::CarsView->value,
                Permission::CarsCreate->value,
                Permission::CarsUpdate->value,
                Permission::CarsDelete->value,
                Permission::WorkOrdersView->value,
                Permission::WorkOrdersCreate->value,
                Permission::WorkOrdersUpdate->value,
                Permission::WorkOrdersDelete->value,
                Permission::WorkOrdersApprove->value,
                Permission::InvoicesView->value,
                Permission::InvoicesCreate->value,
                Permission::SettingsView->value,
                Permission::SettingsUpdate->value,
            ],
        ],
        RoleSlug::Receptionist->value => [
            'name' => 'Receptionist',
            'name_ar' => 'موظف استقبال',
            'permissions' => [
                Permission::DashboardView->value,
                Permission::CarsView->value,
                Permission::CarsCreate->value,
                Permission::CarsUpdate->value,
                Permission::WorkOrdersView->value,
                Permission::WorkOrdersCreate->value,
                Permission::WorkOrdersUpdate->value,
            ],
        ],
        RoleSlug::Technician->value => [
            'name' => 'Technician',
            'name_ar' => 'فني',
            'permissions' => [
                Permission::DashboardView->value,
                Permission::WorkOrdersView->value,
                Permission::WorkOrdersUpdate->value,
            ],
        ],
        RoleSlug::Accountant->value => [
            'name' => 'Accountant',
            'name_ar' => 'محاسب',
            'permissions' => [
                Permission::DashboardView->value,
                Permission::WorkOrdersView->value,
                Permission::InvoicesView->value,
                Permission::InvoicesCreate->value,
            ],
        ],
        RoleSlug::Viewer->value => [
            'name' => 'Viewer',
            'name_ar' => 'مشاهد',
            'permissions' => [
                Permission::DashboardView->value,
                Permission::CarsView->value,
                Permission::WorkOrdersView->value,
                Permission::InvoicesView->value,
            ],
        ],
    ],

    /** Default role for self-registration */
    'default_role' => RoleSlug::Viewer->value,

];
