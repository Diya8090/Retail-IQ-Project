import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  CreditCard,
  Package,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { customerService } from '@/services/customerService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/formatters';

export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa)');
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' ($0) or 'express' ($15)

  // Order Items
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemError, setItemError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        setLoading(true);
        const [custs, prods] = await Promise.all([
          customerService.getCustomers(),
          productService.getProducts(),
        ]);
        setCustomers(custs);
        setProducts(prods);

        if (custs.length > 0) {
          setSelectedCustomerId(custs[0].id);
        }
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
        }
      } catch (err) {
        console.error('Error loading resources', err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  const handleAddItem = () => {
    setItemError('');
    if (!selectedProductId) {
      setItemError('Please select a product.');
      return;
    }
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const qty = Number(itemQuantity);
    if (qty <= 0) {
      setItemError('Quantity must be at least 1.');
      return;
    }

    // Check if item already exists in order
    const existingIndex = orderItems.findIndex((item) => item.productId === selectedProductId);
    if (existingIndex > -1) {
      const updated = [...orderItems];
      const newQty = updated[existingIndex].quantity + qty;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].total = newQty * product.sellingPrice;
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.sellingPrice,
          quantity: qty,
          total: qty * product.sellingPrice,
        },
      ]);
    }

    // Reset item input
    setItemQuantity(1);
  };

  const handleUpdateItemQuantity = (index, newQty) => {
    const qty = Math.max(1, Number(newQty));
    const updated = [...orderItems];
    updated[index].quantity = qty;
    updated[index].total = qty * updated[index].unitPrice;
    setOrderItems(updated);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Pricing calculations
  const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const shippingFee = shippingMethod === 'express' ? 15.0 : 0.0;
  const grandTotal = subtotal + tax + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Please add at least one product to the order.');
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) {
      alert('Please select a valid customer.');
      return;
    }

    try {
      setIsSubmitting(true);
      await orderService.createOrder({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: orderItems,
        subtotal,
        tax,
        shipping: shippingFee,
        total: grandTotal,
        paymentMethod,
      });

      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Initializing order creation workspace..." className="h-96" />;
  }

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="gap-1 pl-1">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <PageHeader
        title="Create New Customer Order"
        subtitle="Generate a verified commercial order, calculate line items and taxes, and dispatch fulfillment."
        breadcrumbs={['Management', 'Orders', 'New Order']}
      />

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Selection & Product Selector (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                Customer Assignment
              </CardTitle>
              <CardDescription>Select the account placing this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Registered Customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                options={customers.map((c) => ({
                  label: `${c.name} (${c.email}) – ${c.city}`,
                  value: c.id,
                }))}
              />

              {selectedCustomer && (
                <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800">{selectedCustomer.name}</span>
                    <p className="text-slate-500">{selectedCustomer.address}, {selectedCustomer.city}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-slate-400">Phone:</span> {selectedCustomer.phone}
                    <p className="text-[11px] text-indigo-600 font-medium">
                      LTV: {formatCurrency(selectedCustomer.totalSpending)} ({selectedCustomer.totalOrders} orders)
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Line Items Builder Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" />
                Order Line Items
              </CardTitle>
              <CardDescription>Add retail products from your catalog to the order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product selector row */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-end bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                <div className="flex-1 w-full">
                  <Select
                    label="Select Product to Add"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    options={products.map((p) => ({
                      label: `${p.name} (${formatCurrency(p.sellingPrice)}) [${p.currentStock} in stock]`,
                      value: p.id,
                    }))}
                  />
                </div>
                <div className="w-24 shrink-0">
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                  />
                </div>
                <Button type="button" size="md" icon={Plus} onClick={handleAddItem} className="shrink-0">
                  Add Item
                </Button>
              </div>

              {itemError && <p className="text-xs text-rose-600 font-medium">{itemError}</p>}

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-center">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderItems.length > 0 ? (
                      orderItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            <p className="text-[10px] font-mono text-slate-400">SKU: {item.sku}</p>
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-700">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemQuantity(idx, e.target.value)}
                              className="w-14 rounded border border-slate-300 py-0.5 text-center text-xs focus:outline-none focus:border-indigo-600"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {formatCurrency(item.total)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No items added yet. Select a product and click Add Item above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment & Order Summary Card (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                Payment & Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { label: 'Credit Card (Visa / Mastercard)', value: 'Credit Card (Visa)' },
                  { label: 'Apple Pay / Google Pay', value: 'Apple Pay' },
                  { label: 'Corporate Wire / Bank Transfer', value: 'Bank Transfer' },
                  { label: 'Cash on Delivery (In-Store)', value: 'Cash On Delivery' },
                ]}
              />

              <Select
                label="Delivery Speed"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                options={[
                  { label: 'Standard Delivery (Free - 3-5 days)', value: 'standard' },
                  { label: 'Express Priority Courier (+$15.00 - Next Day)', value: 'express' },
                ]}
              />

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <span className="font-semibold text-slate-800 text-sm">Order Total Calculation</span>

                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({orderItems.length} lines)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sales Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-sm mt-4"
                isLoading={isSubmitting}
                disabled={orderItems.length === 0}
              >
                Confirm & Create Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};
