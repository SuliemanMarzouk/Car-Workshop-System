<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(CentralDatabaseSeeder::class);
        //
        // Tenant databases are seeded via `Database\Seeders\TenantDatabaseSeeder`
        // executed by `php artisan tenants:seed` (and by the TenantCreated job pipeline).
    }
}
