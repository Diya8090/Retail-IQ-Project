import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    agreeTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters').regex(/^[A-Z0-9-]+$/i, 'SKU may only contain alphanumeric characters and hyphens'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sellingPrice: z.coerce.number().positive('Selling price must be greater than 0'),
  costPrice: z.coerce.number().positive('Cost price must be greater than 0'),
  currentStock: z.coerce.number().int().min(0, 'Current stock cannot be negative'),
  minimumStock: z.coerce.number().int().min(0, 'Minimum stock cannot be negative'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  status: z.enum(['Active', 'Inactive']),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  type: z.enum(['STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT']),
  quantity: z.coerce.number().int().refine((val) => val !== 0, 'Quantity cannot be zero'),
  reason: z.string().min(3, 'Please specify a reason for this stock adjustment'),
});

export const userManagementSchema = z.object({
  name: z.string().min(2, 'User name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Store Manager', 'Sales Analyst']),
  department: z.string().min(2, 'Department is required'),
});
