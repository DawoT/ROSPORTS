
import { useMemo, useState } from 'react';
import { Product } from '../types';
import { CatalogEngine, FilterState, SortOption } from '../services/catalogEngine';

export const useCatalog = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 2000],
    sizes: [],
    colors: [],
    inStock: false
  });

  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filtrado
    let result = CatalogEngine.filter(products, filters, searchQuery);
    
    // 2. Ordenamiento
    return CatalogEngine.sort(result, sortOption);
  }, [products, searchQuery, filters, sortOption]);

  const stats = useMemo(() => ({
    total: products.length,
    visible: filteredAndSortedProducts.length,
    avgPrice: filteredAndSortedProducts.reduce((acc, p) => acc + p.price, 0) / (filteredAndSortedProducts.length || 1)
  }), [products, filteredAndSortedProducts]);

  return {
    products: filteredAndSortedProducts,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    stats
  };
};
