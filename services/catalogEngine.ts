
import { Product } from '../types';

export type SortOption = 'relevance' | 'price_low' | 'price_high' | 'newest' | 'best_sellers';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  sizes: number[];
  colors: string[];
  inStock: boolean;
}

export const CatalogEngine = {
  /**
   * Ejecuta el filtrado multinivel sobre el set de datos maestro.
   */
  filter: (products: Product[], filters: FilterState, query: string): Product[] => {
    return products.filter(p => {
      // Búsqueda por texto (Nombre, SKU, Categoría, Marca)
      const q = query.toLowerCase();
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku_parent?.toLowerCase().includes(q);

      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(p.brand);
      const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      
      const getStock = (prod: Product) => prod.variants?.reduce((acc, v) => 
        acc + v.inventoryLevels.reduce((lAcc, l) => lAcc + (l.quantity - l.reserved), 0), 0) || 0;
      
      const hasStock = getStock(p) > 0;
      const matchesStock = !filters.inStock || hasStock;

      const matchesSize = filters.sizes.length === 0 || p.variants?.some(v => filters.sizes.includes(v.size));
      const matchesColor = filters.colors.length === 0 || p.colors?.some(c => filters.colors.includes(c));

      return matchesQuery && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesSize && matchesColor;
    });
  },

  /**
   * Aplica algoritmos de ordenamiento enterprise.
   */
  sort: (products: Product[], option: SortOption): Product[] => {
    const sorted = [...products];
    switch (option) {
      case 'price_low': return sorted.sort((a, b) => a.price - b.price);
      case 'price_high': return sorted.sort((a, b) => b.price - a.price);
      case 'newest': return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      case 'best_sellers': return sorted.sort((a, b) => (b.tractionScore || 0) - (a.tractionScore || 0)); 
      default: return sorted;
    }
  }
};
