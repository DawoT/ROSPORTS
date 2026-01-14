import { useMemo } from 'react';
import { Product, ProductVariant } from '../types';
import { SIZES } from '../constants';

export interface AuditResult {
  status: 'SUCCESS' | 'PENDING' | 'DENIED';
  message: string;
  canExecute: boolean;
  severity: 'none' | 'warning' | 'error';
  targetVariant?: ProductVariant;
}

const getVariantStock = (v: ProductVariant) => {
  if (!v || !v.inventoryLevels) return 0;
  return v.inventoryLevels.reduce((acc, level) => acc + (level.quantity - level.reserved), 0);
};

export const useInventory = (
  product: Product | null,
  selectedSize: number | null,
  selectedColor: string | null,
) => {
  const availableSizesForColor = useMemo(() => {
    if (!product || !product.variants || !selectedColor) return SIZES;
    return (
      product.variants
        .filter((v) => v.color === selectedColor && getVariantStock(v) > 0)
        .map((v) => v.size) || []
    );
  }, [selectedColor, product]);

  const audit = useMemo((): AuditResult => {
    if (!product) {
      return { status: 'PENDING', message: 'IDLE', canExecute: false, severity: 'none' };
    }

    if (!product.variants || product.variants.length === 0) {
      return {
        status: 'DENIED',
        message: 'ERROR: SIN VARIANTES',
        canExecute: false,
        severity: 'error',
      };
    }

    if (!selectedSize || !selectedColor) {
      const missing =
        !selectedSize && !selectedColor ? 'TALLA Y COLOR' : !selectedSize ? 'TALLA' : 'COLORWAY';
      return {
        status: 'PENDING',
        message: `REQUERIDO: ${missing}`,
        canExecute: false,
        severity: 'warning',
      };
    }

    const target = product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor,
    );
    if (!target)
      return { status: 'DENIED', message: 'NO DISPONIBLE', canExecute: false, severity: 'error' };

    const available = getVariantStock(target);
    if (available <= 0)
      return { status: 'DENIED', message: 'SIN STOCK', canExecute: false, severity: 'error' };

    return {
      status: 'SUCCESS',
      message: 'VALIDADO',
      canExecute: true,
      severity: 'none',
      targetVariant: target,
    };
  }, [product, selectedSize, selectedColor]);

  return { audit, availableSizesForColor, getVariantStock };
};
