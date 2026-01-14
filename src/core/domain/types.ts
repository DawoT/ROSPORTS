/**
 * Represents a specific variation of a product (e.g., Size 42, Red).
 * Corresponds to `product_variants` in ERD.
 */
export interface Variant {
  id: string; // Using string for ID in domain usually safer/standard, though DB is bigint.
  productId: string;
  sku: string;
  barcode?: string;
  size: string;
  color: string;
  /**
   * Price specific to this variant. If null, use product base price.
   */
  priceOverride?: number;
  weight?: number;
  mainImageUrl?: string;
  isActive: boolean;
}

/**
 * Represents the core Product entity.
 * Corresponds to `products` in ERD.
 */
export interface Product {
  id: string;
  name: string;
  slug: string; // Unique URL identifier
  descriptionShort?: string;
  descriptionLong?: string;
  brandId?: string;
  categoryId?: string;
  /**
   * Base price in major currency units (e.g., 100.00).
   * Consider using cents (integer) for internal logic if precision is critical, but mirroring ERD 'decimal' here as number.
   */
  basePrice: number;
  costPrice?: number;
  taxCode?: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  /**
   * Arbitrary attributes (e.g., material, year)
   */
  attributes?: Record<string, unknown>;

  /**
   * Hydrated variants for this product.
   */
  variants?: Variant[];
}

/**
 * Represents an item within a shopping cart or order.
 */
export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantSku: string;
  /**
   * Quantity to purchase. Must be > 0.
   */
  quantity: number;
  /**
   * Unit price at the time of adding to cart.
   */
  unitPrice: number;
}

/**
 * Represents a customer Order.
 * Corresponds to `orders` in ERD.
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  locationId?: string;
  channel: "WEB" | "STORE" | "APP";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingCost: number;
  grandTotal: number;
  items: CartItem[];
  createdAt: Date;
}

/**
 * Represents a stock movement in the inventory system.
 * Corresponds to `inventory_movements` in ERD.
 */
export interface InventoryMovement {
  id: string;
  variantId: string;
  fromLocationId?: string;
  toLocationId?: string;
  userId?: string;
  type: "SALE" | "PURCHASE" | "ADJUSTMENT" | "TRANSFER" | "RESERVE" | "RELEASE";
  quantity: number;
  /**
   * Reference to the source document (e.g., Order ID, PO Number).
   */
  referenceDoc?: string;
  notes?: string;
  createdAt: Date;
}
