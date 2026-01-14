import { describe, it, expect } from 'vitest';
import {
    DomainError,
    ProductNotFoundError,
    StockInsufficientError,
    InvalidOperationError,
} from '@/lib/errors';

describe('Custom Error Classes', () => {
    describe('DomainError', () => {
        it('should be an instance of Error', () => {
            const error = new DomainError('test');
            expect(error).toBeInstanceOf(Error);
        });

        it('should have correct name', () => {
            const error = new DomainError('test');
            expect(error.name).toBe('DomainError');
        });

        it('should preserve message', () => {
            const error = new DomainError('Custom message');
            expect(error.message).toBe('Custom message');
        });
    });

    describe('ProductNotFoundError', () => {
        it('should extend DomainError', () => {
            const error = new ProductNotFoundError('test-slug');
            expect(error).toBeInstanceOf(DomainError);
        });

        it('should have correct name', () => {
            const error = new ProductNotFoundError('test-slug');
            expect(error.name).toBe('ProductNotFoundError');
        });

        it('should include product identifier in message', () => {
            const error = new ProductNotFoundError('nike-air-max');
            expect(error.message).toContain('nike-air-max');
        });
    });

    describe('StockInsufficientError', () => {
        it('should extend DomainError', () => {
            const error = new StockInsufficientError('SKU-001', 5, 2);
            expect(error).toBeInstanceOf(DomainError);
        });

        it('should have correct name', () => {
            const error = new StockInsufficientError('SKU-001', 5, 2);
            expect(error.name).toBe('StockInsufficientError');
        });

        it('should expose sku property', () => {
            const error = new StockInsufficientError('NIKE-AIR-MAX-42', 5, 2);
            expect(error.sku).toBe('NIKE-AIR-MAX-42');
        });

        it('should expose requested property', () => {
            const error = new StockInsufficientError('SKU-001', 10, 3);
            expect(error.requested).toBe(10);
        });

        it('should expose available property', () => {
            const error = new StockInsufficientError('SKU-001', 10, 3);
            expect(error.available).toBe(3);
        });

        it('should format user-friendly message', () => {
            const error = new StockInsufficientError('SKU-001', 10, 3);
            expect(error.message).toContain('3');
            expect(error.message).toContain('Available');
        });

        it('should handle zero available stock', () => {
            const error = new StockInsufficientError('SKU-001', 2, 0);
            expect(error.available).toBe(0);
        });
    });

    describe('InvalidOperationError', () => {
        it('should extend DomainError', () => {
            const error = new InvalidOperationError('Cannot cancel shipped order');
            expect(error).toBeInstanceOf(DomainError);
        });

        it('should have correct name', () => {
            const error = new InvalidOperationError('test');
            expect(error.name).toBe('InvalidOperationError');
        });

        it('should describe the invalid operation', () => {
            const message = 'Cannot archive a product with pending orders';
            const error = new InvalidOperationError(message);
            expect(error.message).toBe(message);
        });
    });

    describe('Error Inheritance Chain', () => {
        it('all domain errors should be catchable as Error', () => {
            const errors = [
                new DomainError('test'),
                new ProductNotFoundError('id'),
                new StockInsufficientError('sku', 1, 0),
                new InvalidOperationError('op'),
            ];

            for (const error of errors) {
                expect(error).toBeInstanceOf(Error);
            }
        });

        it('specific errors should be distinguishable by instanceof', () => {
            const stockError = new StockInsufficientError('sku', 1, 0);
            const notFoundError = new ProductNotFoundError('id');

            expect(stockError).toBeInstanceOf(StockInsufficientError);
            expect(stockError).not.toBeInstanceOf(ProductNotFoundError);
            expect(notFoundError).toBeInstanceOf(ProductNotFoundError);
            expect(notFoundError).not.toBeInstanceOf(StockInsufficientError);
        });
    });
});
