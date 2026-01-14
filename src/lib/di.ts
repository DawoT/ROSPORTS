import { IInventoryRepository } from '@/core/repositories/inventory.repository';
import { ICatalogRepository } from '@/core/repositories/catalog.repository';
import { IOrderRepository } from '@/core/repositories/order.repository';
import { MockInventoryRepository } from '@/infrastructure/adapters/mock-inventory.repository';
import { DrizzleInventoryRepository } from '@/infrastructure/adapters/drizzle-inventory.repository';
import { DrizzleCatalogRepository } from '@/infrastructure/adapters/drizzle-catalog.repository';
import { DrizzleOrderRepository } from '@/infrastructure/adapters/drizzle-order.repository';
import { env } from '@/env';

/**
 * Simple Dependency Injection Container.
 * Returns Mock or Real implementations based on environment.
 */

let inventoryRepoInstance: IInventoryRepository | null = null;
let catalogRepoInstance: ICatalogRepository | null = null;
let orderRepoInstance: IOrderRepository | null = null;

export const getInventoryRepository = (): IInventoryRepository => {
    if (inventoryRepoInstance) return inventoryRepoInstance;

    if (env.USE_MOCK === 'true') {
        // Mock with sample data for development/testing
        inventoryRepoInstance = new MockInventoryRepository({
            'SKU-001': 100,
            'SKU-002': 50,
            'SKU-003': 10,
        });
    } else {
        inventoryRepoInstance = new DrizzleInventoryRepository();
    }

    return inventoryRepoInstance;
};

export const getCatalogRepository = (): ICatalogRepository => {
    if (catalogRepoInstance) return catalogRepoInstance;

    // For now, always use Drizzle for catalog (no mock needed for reads)
    catalogRepoInstance = new DrizzleCatalogRepository();

    return catalogRepoInstance;
};

export const getOrderRepository = (): IOrderRepository => {
    if (orderRepoInstance) return orderRepoInstance;

    orderRepoInstance = new DrizzleOrderRepository();

    return orderRepoInstance;
};

// Reset and Injection functions for testing
export const resetRepositories = (): void => {
    inventoryRepoInstance = null;
    catalogRepoInstance = null;
    orderRepoInstance = null;
};

export const setInventoryRepository = (repo: IInventoryRepository): void => {
    inventoryRepoInstance = repo;
};

export const setCatalogRepository = (repo: ICatalogRepository): void => {
    catalogRepoInstance = repo;
};

export const setOrderRepository = (repo: IOrderRepository): void => {
    orderRepoInstance = repo;
};
