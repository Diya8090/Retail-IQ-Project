import { initialProducts } from '@/data/products';

let productsState = [...initialProducts];

export const productService = {
  async getProducts({ search = '', category = '', status = '', sort = '' } = {}) {
    await new Promise((r) => setTimeout(r, 200));
    let filtered = [...productsState];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((p) => p.status === status);
    }

    return filtered;
  },

  async getProductById(id) {
    await new Promise((r) => setTimeout(r, 150));
    return productsState.find((p) => p.id === id) || null;
  },

  async createProduct(productData) {
    await new Promise((r) => setTimeout(r, 300));
    const newProduct = {
      ...productData,
      id: 'prod-' + Date.now(),
      totalSold: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status:
        Number(productData.currentStock) === 0
          ? 'Out of Stock'
          : Number(productData.currentStock) <= Number(productData.minimumStock)
          ? 'Low Stock'
          : 'In Stock',
    };
    productsState = [newProduct, ...productsState];
    return newProduct;
  },

  async updateProduct(id, updates) {
    await new Promise((r) => setTimeout(r, 300));
    const currentStock = updates.currentStock !== undefined ? Number(updates.currentStock) : undefined;
    const minimumStock = updates.minimumStock !== undefined ? Number(updates.minimumStock) : undefined;

    let computedStatus = updates.status;
    if (currentStock !== undefined && minimumStock !== undefined) {
      computedStatus =
        currentStock === 0 ? 'Out of Stock' : currentStock <= minimumStock ? 'Low Stock' : 'In Stock';
    }

    productsState = productsState.map((p) =>
      p.id === id ? { ...p, ...updates, ...(computedStatus && { status: computedStatus }) } : p
    );
    return productsState.find((p) => p.id === id);
  },

  async deleteProduct(id) {
    await new Promise((r) => setTimeout(r, 250));
    productsState = productsState.filter((p) => p.id !== id);
    return true;
  },
};
