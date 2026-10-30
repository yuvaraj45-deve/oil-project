import React, { useState } from 'react';
import {
  X,
  Package,
  TrendingUp,
  ShoppingBag,
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  FileText,
  DollarSign,
  Boxes,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { PlacedOrder, Product } from '../types';
import { PRODUCTS_DATA } from '../data/oilData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: PlacedOrder['orderStatus']) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics' | 'quality'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  // KPIs
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalItemsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const processingCount = orders.filter((o) => o.orderStatus === 'PROCESSING').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PlacedOrder['orderStatus']) => {
    switch (status) {
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PACKED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const handleNextStatus = (order: PlacedOrder) => {
    const sequence: PlacedOrder['orderStatus'][] = [
      'PROCESSING',
      'PACKED',
      'SHIPPED',
      'DELIVERED',
    ];
    const currentIndex = sequence.indexOf(order.orderStatus);
    if (currentIndex < sequence.length - 1) {
      onUpdateOrderStatus(order.id, sequence[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-cream-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  SS OIL Mill Management Portal
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Store Admin v2.4
                </span>
              </div>
              <p className="text-xs text-cream-200/70">
                SS OIL Mara Chekku Mill • Live Inventory & Dispatch Controller
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-cream-200/70 hover:text-white hover:bg-forest-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-cream-200 bg-cream-100/60 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-forest-900 text-forest-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Dispatch</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-forest-900 text-gold-400 font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-forest-900 text-forest-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({PRODUCTS_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quality'
                ? 'border-forest-900 text-forest-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GC-MS Quality Logs</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-cream-50/50">
          
          {/* Top KPI Cards (Always visible) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-serif text-xl font-bold text-forest-950">
                  ₹{totalRevenue.toLocaleString()}
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Total Orders
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-serif text-xl font-bold text-forest-950">
                  {orders.length}
                </span>
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                To Pack & Ship
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-serif text-xl font-bold text-amber-700">
                  {processingCount}
                </span>
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Delivered Pure
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-serif text-xl font-bold text-emerald-700">
                  {deliveredCount}
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: ORDERS TABLE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order ID, name, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800/20 bg-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {['ALL', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-forest-900 text-cream-100'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-cream-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cream-100/70 border-b border-cream-200 text-stone-600 font-serif">
                      <tr>
                        <th className="py-3 px-4 font-bold">Order ID</th>
                        <th className="py-3 px-4 font-bold">Customer</th>
                        <th className="py-3 px-4 font-bold">Items & Packs</th>
                        <th className="py-3 px-4 font-bold">Total</th>
                        <th className="py-3 px-4 font-bold">Payment</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-stone-400 text-xs">
                            No orders matching the current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-cream-50/60 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-forest-950">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-stone-900 block">
                                {order.customerName}
                              </span>
                              <span className="text-[11px] text-stone-500">
                                {order.customerPhone}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-stone-800 line-clamp-1">
                                {order.items.map((i) => `${i.productName} (${i.packSize})`).join(', ')}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} total units
                              </span>
                            </td>
                            <td className="py-3 px-4 font-serif font-bold text-forest-900">
                              ₹{order.totalAmount}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${getStatusBadge(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {order.orderStatus !== 'DELIVERED' ? (
                                <button
                                  onClick={() => handleNextStatus(order)}
                                  className="px-2.5 py-1 rounded-lg bg-forest-900 hover:bg-forest-800 text-cream-100 text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                >
                                  <span>Advance</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                                  <CheckCircle className="w-3 h-3" /> Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT INVENTORY */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTS_DATA.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex gap-4 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-cream-200 bg-cream-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        {product.extractionMethod}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> In Stock
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-forest-950 mt-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Baseline: <strong className="text-forest-900">₹{product.price}</strong> (MRP ₹{product.originalPrice})
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.packSizes.map((pack) => (
                        <span
                          key={pack}
                          className="px-2 py-0.5 rounded bg-cream-100 text-[10px] text-stone-700 border border-cream-300 font-medium"
                        >
                          {pack}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: QUALITY CONTROL / LAB REPORTS */}
          {activeTab === 'quality' && (
            <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div>
                  <h4 className="font-serif font-bold text-sm text-forest-950">
                    Official GC-MS Gas Chromatography Purity Logs
                  </h4>
                  <p className="text-xs text-stone-500">
                    Spectrometric purity analysis for authentic mill batches (FSSAI & NABL accredited)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Zero Hexane Certified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Free Fatty Acid (FFA)
                  </span>
                  <div className="text-base font-bold text-forest-900">&lt; 0.35%</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Standard limit: &lt; 1.5%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Peroxide Value (PV)
                  </span>
                  <div className="text-base font-bold text-forest-900">&lt; 1.8 meq/kg</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Ultra-low oxidation</span>
                </div>

                <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Natural Vitamin E
                  </span>
                  <div className="text-base font-bold text-forest-900">28.4 mg / 100g</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Zero chemical stripped</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cream-200 bg-cream-100/60 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>SS OIL E-Commerce Operating System</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-forest-900 text-cream-100 font-bold hover:bg-forest-800 transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
