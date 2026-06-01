<?php

namespace App\Domain\Authorization\Enums;

enum RoleSlug: string
{
    case OrganizationAdmin = 'organization_admin';
    case WorkshopManager = 'workshop_manager';
    case Receptionist = 'receptionist';
    case Technician = 'technician';
    case Accountant = 'accountant';
    case Viewer = 'viewer';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
