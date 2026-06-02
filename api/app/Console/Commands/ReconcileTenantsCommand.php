<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Domain\Setting\Enums\SettingKey;
use App\Infrastructure\Tenancy\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ReconcileTenantsCommand extends Command
{
    protected $signature = 'tenants:reconcile
                            {--dry-run : List orphan tenant databases without registering them}';

    protected $description = 'Register tenant databases that exist on the server but are missing from the central tenants table';

    public function handle(): int
    {
        $prefix = (string) config('tenancy.database.prefix', 'tenant_');
        $driver = (string) config('database.connections.' . config('tenancy.database.template_tenant_connection') . '.driver', 'mysql');

        $orphanIds = $this->discoverOrphanTenantIds($driver, $prefix);

        if ($orphanIds === []) {
            $this->info('No orphan tenant databases found.');

            return self::SUCCESS;
        }

        $this->info('Found ' . count($orphanIds) . ' orphan tenant database(s):');

        foreach ($orphanIds as $tenantId) {
            $this->line("  - {$tenantId}");
        }

        if ($this->option('dry-run')) {
            $this->comment('Dry run — no changes made.');

            return self::SUCCESS;
        }

        $registered = 0;

        foreach ($orphanIds as $tenantId) {
            if ($this->registerTenant($tenantId)) {
                $registered++;
                $this->info("Registered: {$tenantId}");
            }
        }

        $this->info("Done. Registered {$registered} workshop(s) in central.");

        return self::SUCCESS;
    }

    /** @return list<string> */
    private function discoverOrphanTenantIds(string $driver, string $prefix): array
    {
        $existing = Tenant::query()->pluck('id')->all();
        $discovered = $driver === 'sqlite'
            ? $this->discoverSqliteTenantIds($prefix)
            : $this->discoverMysqlTenantIds($prefix);

        return array_values(array_filter(
            $discovered,
            fn (string $id) => ! in_array($id, $existing, true),
        ));
    }

    /** @return list<string> */
    private function discoverMysqlTenantIds(string $prefix): array
    {
        $ids = [];

        foreach (DB::connection('central')->select('SHOW DATABASES') as $row) {
            $database = (string) (array_values((array) $row)[0] ?? '');

            if (! str_starts_with($database, $prefix)) {
                continue;
            }

            $tenantId = substr($database, strlen($prefix));

            if ($tenantId !== '') {
                $ids[] = $tenantId;
            }
        }

        sort($ids);

        return $ids;
    }

    /** @return list<string> */
    private function discoverSqliteTenantIds(string $prefix): array
    {
        $ids = [];
        $pattern = database_path(DIRECTORY_SEPARATOR . $prefix . '*');

        foreach (glob($pattern) ?: [] as $path) {
            if (! is_file($path)) {
                continue;
            }

            $tenantId = substr(basename($path), strlen($prefix));

            if ($tenantId !== '') {
                $ids[] = $tenantId;
            }
        }

        sort($ids);

        return $ids;
    }

    private function registerTenant(string $tenantId): bool
    {
        if (Tenant::query()->whereKey($tenantId)->exists()) {
            return false;
        }

        $domain = "{$tenantId}.localhost";

        Tenant::withoutEvents(function () use ($tenantId, $domain): void {
            /** @var Tenant $tenant */
            $tenant = Tenant::query()->create([
                'id' => $tenantId,
                'name' => $tenantId,
            ]);

            $tenant->domains()->create(['domain' => $domain]);
        });

        /** @var Tenant $tenant */
        $tenant = Tenant::query()->findOrFail($tenantId);
        $displayName = $this->resolveWorkshopDisplayName($tenant);

        if ($displayName !== $tenantId) {
            $tenant->update(['name' => $displayName]);
        }

        return true;
    }

    private function resolveWorkshopDisplayName(Tenant $tenant): string
    {
        tenancy()->initialize($tenant);

        try {
            $name = trim((string) app(SettingRepositoryInterface::class)->get(
                SettingKey::WorkshopName->value,
                '',
            ));

            return $name !== '' ? $name : (string) $tenant->id;
        } catch (\Throwable) {
            return (string) $tenant->id;
        } finally {
            tenancy()->end();
        }
    }
}
