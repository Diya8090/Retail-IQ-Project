import { initialCategories } from '@/data/categories';

let categoriesState = [...initialCategories];

export const categoryService = {
  async getCategories(search = '') {
    await new Promise((r) => setTimeout(r, 150));
    if (!search) return categoriesState;
    const q = search.toLowerCase();
    return categoriesState.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  },

  async createCategory(catData) {
    await new Promise((r) => setTimeout(r, 250));
    const newCategory = {
      ...catData,
      id: 'cat-' + Date.now(),
      slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      productCount: 0,
      createdAt: new Date().toISOString(),
    };
    categoriesState = [newCategory, ...categoriesState];
    return newCategory;
  },

  async updateCategory(id, updates) {
    await new Promise((r) => setTimeout(r, 250));
    categoriesState = categoriesState.map((c) => (c.id === id ? { ...c, ...updates } : c));
    return categoriesState.find((c) => c.id === id);
  },

  async deleteCategory(id) {
    await new Promise((r) => setTimeout(r, 200));
    categoriesState = categoriesState.filter((c) => c.id !== id);
    return true;
  },
};
