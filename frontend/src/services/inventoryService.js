import { initialInventoryMovements } from '@/data/inventory';
import { productService } from './productService';

let movementsState = [...initialInventoryMovements];

export const inventoryService = {
  async getMovements(search = '', type = 'All') {
    await new Promise((r) => setTimeout(r, 200));
    let filtered = [...movementsState];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.productName.toLowerCase().includes(q) ||
          m.sku.toLowerCase().includes(q) ||
          m.reason.toLowerCase().includes(q) ||
          m.performedBy.toLowerCase().includes(q)
      );
    }

    if (type && type !== 'All') {
      filtered = filtered.filter((m) => m.type === type);
    }

    return filtered;
  },

  async recordStockMovement({ productId, type, quantity, reason, performedBy = 'Current User' }) {
    await new Promise((r) => setTimeout(r, 300));
    const product = await productService.getProductById(productId);
    if (!product) throw new Error('Product not found.');

    const qtyNumber = Number(quantity);
    let delta = qtyNumber;
    if (type === 'STOCK_OUT') delta = -Math.abs(qtyNumber);
    if (type === 'STOCK_IN') delta = Math.abs(qtyNumber);
    // For ADJUSTMENT, qty can be positive or negative

    const previousStock = product.currentStock;
    const newStock = Math.max(0, previousStock + delta);

    // Update product stock
    await productService.updateProduct(productId, { currentStock: newStock });

    const movement = {
      id: 'mov-' + Date.now(),
      productId,
      productName: product.name,
      sku: product.sku,
      type,
      quantity: delta,
      previousStock,
      newStock,
      reason,
      performedBy,
      timestamp: new Date().toISOString(),
    };

    movementsState = [movement, ...movementsState];
    return movement;
  },

  async getInventorySummary() {
    const products = await productService.getProducts();
    const totalUnits = products.reduce((acc, p) => acc + (Number(p.currentStock) || 0), 0);
    const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
    const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;
    const totalValuation = products.reduce(
      (acc, p) => acc + (Number(p.currentStock) || 0) * (Number(p.costPrice) || 0),
      0
    );

    return {
      totalUnits,
      lowStockCount,
      outOfStockCount,
      totalValuation,
      totalProducts: products.length,
    };
  },
};
