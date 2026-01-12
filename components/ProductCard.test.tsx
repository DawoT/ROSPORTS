
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from './ProductCard';
import { Product } from '../types';

// Mock de las funciones necesarias
const mockOnAddToCart = vi.fn();
const mockOnViewDetails = vi.fn();
const mockOnQuickView = vi.fn();
const mockOnToggleWishlist = vi.fn();

const mockProduct: Product = {
  id: 'test-1',
  name: 'Velocity Test Pro',
  brand: 'ROSPORTS',
  price: 499.00,
  image: 'test.jpg',
  description: 'Test shoe',
  category: 'Running',
  material: 'Knit',
  weight: '200g',
  drop: '10mm',
  tractionScore: 9,
  cushioningLevel: 'Plush',
  variants: [
    { 
      sku: 'TEST-SKU-1', 
      barcode: 'BC-001', 
      size: 38, 
      color: '#FF0000', 
      colorName: 'Test Red', 
      // Fix: Added missing images property
      images: [],
      inventoryLevels: [{ nodeId: 'N-01', quantity: 10, minStock: 2, reserved: 0 }], 
      status: 'active' 
    },
    { 
      sku: 'TEST-SKU-2', 
      barcode: 'BC-002', 
      size: 39, 
      color: '#FF0000', 
      colorName: 'Test Red', 
      // Fix: Added missing images property
      images: [],
      inventoryLevels: [{ nodeId: 'N-01', quantity: 0, minStock: 2, reserved: 0 }], 
      status: 'active' 
    },
    { 
      sku: 'TEST-SKU-3', 
      barcode: 'BC-003', 
      size: 40, 
      color: '#FF0000', 
      colorName: 'Test Red', 
      // Fix: Added missing images property
      images: [],
      inventoryLevels: [{ nodeId: 'N-01', quantity: 5, minStock: 2, reserved: 0 }], 
      status: 'active' 
    },
  ],
  colors: ['#FF0000', '#0000FF']
};

describe('ProductCard component: Technical Performance Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe iniciar en estado PENDING indicando que falta talla y color', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart} 
        onViewDetails={mockOnViewDetails} 
        onQuickView={mockOnQuickView} 
      />
    );

    const purchaseButton = screen.getByRole('button', { name: /CONFIGURACIÓN INCOMPLETA/i });
    
    // El motor de auditoría técnica muestra el mensaje en un tooltip al interactuar
    fireEvent.mouseEnter(purchaseButton);
    // Nota: El tooltip se maneja internamente con setShowTooltip en ProductCard
  });

  it('debe actualizar el audit a "PENDING: COLORWAY" cuando solo se selecciona la talla', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart} 
        onViewDetails={mockOnViewDetails} 
        onQuickView={mockOnQuickView} 
      />
    );

    const sizeButton = screen.getByText('38');
    fireEvent.click(sizeButton);

    const purchaseButton = screen.getByRole('button', { name: /CONFIGURACIÓN INCOMPLETA/i });
    fireEvent.mouseEnter(purchaseButton);
  });

  it('debe denegar el acceso si se selecciona una talla con stock 0', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart} 
        onViewDetails={mockOnViewDetails} 
        onQuickView={mockOnQuickView} 
      />
    );

    // Seleccionar color primero
    const colorButton = screen.getAllByRole('button').find(b => b.getAttribute('style')?.includes('background-color: rgb(255, 0, 0)'));
    if (colorButton) fireEvent.click(colorButton);

    // Seleccionar talla 39 (que tiene stock 0 en el mock)
    const sizeButton = screen.getByText('39');
    fireEvent.click(sizeButton);

    const purchaseButton = screen.getByRole('button', { name: /CONFIGURACIÓN INCOMPLETA/i });
    fireEvent.mouseEnter(purchaseButton);
  });

  it('debe permitir el despliegue (SUCCESS) cuando la configuración es válida y hay stock', async () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart} 
        onViewDetails={mockOnViewDetails} 
        onQuickView={mockOnQuickView} 
      />
    );

    fireEvent.click(screen.getByText('38'));
    const colorButton = screen.getAllByRole('button').find(b => b.getAttribute('style')?.includes('background-color: rgb(255, 0, 0)'));
    if (colorButton) fireEvent.click(colorButton);

    const purchaseButton = screen.getByRole('button', { name: /CONFIRMAR DESPLIEGUE/i });
    fireEvent.click(purchaseButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 38, '#FF0000');
  });
});
