<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Central seeding intentionally left empty.
        //
        // Tenant databases are seeded via `Database\Seeders\TenantDatabaseSeeder`
        // executed by `php artisan tenants:seed` (and by the TenantCreated job pipeline).
    }
}
