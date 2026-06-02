<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\CentralUser;
use Illuminate\Database\Seeder;

class CentralDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        CentralUser::query()->updateOrCreate(
            ['email' => 'admin@platform.local'],
            [
                'name' => 'Platform Super Admin',
                'password' => 'password',
            ],
        );
    }
}
