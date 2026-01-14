import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DrizzleCatalogRepository } from '@/infrastructure/adapters/drizzle-catalog.repository';

describe('Minimal Integration', () => {
    it('imports repo', () => {
        assert.ok(DrizzleCatalogRepository);
        console.log('Repo imported:', DrizzleCatalogRepository.name);
    });
});
