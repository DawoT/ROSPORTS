export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ProductNotFoundError extends DomainError {
  constructor(slugOrId: string) {
    super(`Product with identifier "${slugOrId}" not found.`);
    this.name = 'ProductNotFoundError';
  }
}

export class StockInsufficientError extends DomainError {
  public readonly sku: string;
  public readonly requested: number;
  public readonly available: number;

  constructor(sku: string, requested: number, available: number) {
    super(
      `Insufficient stock for SKU ${sku}. Requested: ${requested}, Available: ${available}`,
    );
    this.name = 'StockInsufficientError';
    this.sku = sku;
    this.requested = requested;
    this.available = available;
  }
}

export class InvalidOperationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOperationError';
  }
}
