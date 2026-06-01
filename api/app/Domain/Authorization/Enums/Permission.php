<?php

namespace App\Domain\Authorization\Enums;

enum Permission: string
{
    case DashboardView = 'dashboard.view';

    case CarsView = 'cars.view';
    case CarsCreate = 'cars.create';
    case CarsUpdate = 'cars.update';
    case CarsDelete = 'cars.delete';

    case WorkOrdersView = 'work_orders.view';
    case WorkOrdersCreate = 'work_orders.create';
    case WorkOrdersUpdate = 'work_orders.update';
    case WorkOrdersDelete = 'work_orders.delete';
    case WorkOrdersApprove = 'work_orders.approve';

    case InvoicesView = 'invoices.view';
    case InvoicesCreate = 'invoices.create';

    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersUpdate = 'users.update';
    case UsersDelete = 'users.delete';

    case SettingsView = 'settings.view';
    case SettingsUpdate = 'settings.update';

    case RolesView = 'roles.view';
    case RolesCreate = 'roles.create';
    case RolesUpdate = 'roles.update';
    case RolesDelete = 'roles.delete';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
