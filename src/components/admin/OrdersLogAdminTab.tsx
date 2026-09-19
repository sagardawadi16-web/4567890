import React, { useState } from 'react';
import { useShopStore } from '../../store/shopStore';
import { Order, OrderStatus } from '../../types';
import {
  Truck,
  Package,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Filter,
  CreditCard,
  UserCheck,
  Send,
  Plus,
  X,
} from 'lucide-react';

interface OrdersLogAdminTabProps {
  onShowToast: (msg: string) => void;
}

export const OrdersLogAdminTab: React.FC<OrdersLogAdminTabProps> = ({ onShowToast }) => {
  const {
    ordersLog,
    updateOrderStatus,
    deleteOrderFromLog,
    clearOrdersLog,
    addManualOrderToLog,
    formatPrice,
    products,
  } = useShopStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Logistics tracking editing state
  const [editingLogisticsId, setEditingLogisticsId] = useState<string | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingNoInput, setTrackingNoInput] = useState('');
  const [logisticsNotesInput, setLogisticsNotesInput] = useState('');

  // Manual order creation modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCity, setManualCity] = useState('Kathmandu');
  const [manualAddress, setManualAddress] = useState('');
  const [manualProductId, setManualProductId] = useState('');
  const [manualSize, setManualSize] = useState('Free Size');
  const [manualCourier, setManualCourier] = useState('Pathao Express Logistics');

  const filteredOrders = ordersLog.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesQuery =
      ord.orderNumber.toLowerCase().includes(query) ||
      ord.shippingAddress.fullName.toLowerCase().includes(query) ||
      ord.shippingAddress.phone.includes(query) ||
      ord.shippingAddress.city.toLowerCase().includes(query) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(query)) ||
      (ord.courierName && ord.courierName.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });

  const handleStartLogisticsEdit = (ord: Order) => {
    setEditingLogisticsId(ord.id);
    setCourierInput(ord.courierName || 'Pathao Express Logistics');
    setTrackingNoInput(ord.trackingNumber || '');
    setLogisticsNotesInput(ord.logisticsNotes || '');
  };

  const handleSaveLogistics = (orderId: string, currentStatus: OrderStatus) => {
    updateOrderStatus(orderId, currentStatus, {
      courierName: courierInput.trim(),
      trackingNumber: trackingNoInput.trim(),
      logisticsNotes: logisticsNotesInput.trim(),
    });
    setEditingLogisticsId(null);
    onShowToast('Logistics and dispatch information updated!');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    onShowToast(`Order status updated to: ${newStatus.toUpperCase()}`);
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (window.confirm(`Delete order log #${orderNumber}? This will remove it from shipping logs.`)) {
      deleteOrderFromLog(orderId);
      onShowToast(`Order #${orderNumber} removed from log.`);
    }
  };

  const handleExportCSV = () => {
    if (ordersLog.length === 0) {
      alert('No orders in log to export');
      return;
    }

    const headers = [
      'OrderNumber',
      'Date',
      'Customer',
      'Phone',
      'City',
      'Address',
      'TotalAmount',
      'PaymentMethod',
      'Status',
      'Courier',
      'TrackingNumber',
      'LogisticsNotes',
    ];

    const rows = ordersLog.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.shippingAddress.fullName.replace(/"/g, '""')}"`,
      `"${o.shippingAddress.phone}"`,
      `"${o.shippingAddress.city}"`,
      `"${o.shippingAddress.addressLine.replace(/"/g, '""')}"`,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      `"${(o.courierName || '').replace(/"/g, '""')}"`,
      `"${(o.trackingNumber || '').replace(/"/g, '""')}"`,
      `"${(o.logisticsNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dawosti_logistics_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Exported logistics shipping manifest (.csv)!');
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualPhone.trim()) {
      alert('Please provide customer name and phone');
      return;
    }

    const selectedProduct = products.find((p) => p.id === manualProductId) || products[0];

    const newOrder: Order = {
      id: `ord-man-${Date.now()}`,
      orderNumber: `DAW-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [
        {
          product: selectedProduct,
          selectedSize: manualSize,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      subtotalAmount: selectedProduct.price,
      discountAmount: 0,
      deliveryFee: 0,
      totalAmount: selectedProduct.price,
      shippingAddress: {
        fullName: manualCustomerName.trim(),
        phone: manualPhone.trim(),
        addressLine: manualAddress.trim() || 'Kathmandu Boutique Pickup / Offline',
        city: manualCity,
        province: 'Bagmati Province',
      },
      paymentMethod: 'cod',
      status: 'processing',
      createdAt: new Date().toISOString(),
      notes: 'Manually logged phone/walk-in boutique order',
      courierName: manualCourier,
      trackingNumber: `MAN-${Date.now().toString().slice(-5)}`,
      logisticsNotes: 'Logged manually for dispatch dispatch logistics.',
    };

    addManualOrderToLog(newOrder);
    setShowManualModal(false);
    setManualCustomerName('');
    setManualPhone('');
    setManualAddress('');
    onShowToast(`Logged new order #${newOrder.orderNumber} for ${newOrder.shippingAddress.fullName}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#EADCCE] shadow-xs">
        <div>
          <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2B1810] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#8B3A3A]" />
            <span>Logistics & Product Purchases Dispatch Log</span>
          </h3>
          <p className="text-xs text-[#6B564C] mt-0.5">
            Track customer buys, dispatch parcels across Nepal, manage courier tracking numbers, and update shipment milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#EADCCE] text-[#2B1810] hover:bg-[#FAF2E9] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Download className="w-3.5 h-3.5 text-[#8B3A3A]" />
            <span>Export Manifest (.csv)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="min-h-[44px] px-4 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log New Order</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADCCE] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B564C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone, City or Tracking #..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm text-[#2B1810] outline-none placeholder-[#6B564C]/60"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#6B564C] shrink-0 mr-1" />
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-[#8B3A3A] text-white'
                  : 'bg-[#FAF2E9] text-[#6B564C] hover:text-[#2B1810]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EADCCE] p-8 text-center space-y-3">
          <Package className="w-10 h-10 text-[#6B564C]/40 mx-auto" />
          <p className="text-sm font-bold text-[#2B1810]">No orders found matching your search</p>
          <p className="text-xs text-[#6B564C]">Try clearing the search query or status filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            const isEditingLogistics = editingLogisticsId === ord.id;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-[#EADCCE] overflow-hidden shadow-xs transition-all hover:border-[#8B3A3A]/40"
              >
                {/* Order Row Header */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Number, Customer, Date */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF2E9] border border-[#EADCCE] flex items-center justify-center shrink-0 text-[#8B3A3A] mt-0.5">
                      <Package className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#8B3A3A]">
                          #{ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                        <span className="text-[11px] font-bold text-[#6B564C] uppercase bg-gray-100 px-2 py-0.5 rounded-md">
                          {ord.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm font-bold text-[#2B1810]">
                          {ord.shippingAddress.fullName}
                        </span>
                        <span className="text-xs text-[#6B564C] flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-[#8B3A3A]" />
                          {ord.shippingAddress.phone}
                        </span>
                        <span className="text-xs text-[#6B564C] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#8B3A3A]" />
                          {ord.shippingAddress.city}, {ord.shippingAddress.province || 'Nepal'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#6B564C] mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Placed on {new Date(ord.createdAt).toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amount & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#FAF2E9]">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-[#6B564C]">Order Total</p>
                      <p className="text-base sm:text-lg font-bold text-[#8B3A3A] font-mono">
                        {formatPrice(ord.totalAmount)}
                      </p>
                      <p className="text-[10px] text-[#6B564C]">{ord.items.length} item(s)</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status quick select */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 rounded-xl border border-[#EADCCE] bg-[#FAF2E9] text-xs font-bold text-[#2B1810] outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setExpandedOrderId((prev) => (prev === ord.id ? null : ord.id))}
                        className="p-2 rounded-xl border border-[#EADCCE] text-[#6B564C] hover:bg-[#FAF2E9] transition-colors"
                        title="Toggle order details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                        className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logistics Bar */}
                <div className="bg-[#FAF2E9]/60 px-4 sm:px-5 py-2.5 border-t border-[#EADCCE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-[#2B1810] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#8B3A3A]" />
                      <span>Logistics Courier:</span>
                      <span className="text-[#8B3A3A] font-semibold">
                        {ord.courierName || 'Not Assigned Yet'}
                      </span>
                    </span>

                    {ord.trackingNumber && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#EADCCE] text-[#2B1810]">
                        Waybill: <strong>{ord.trackingNumber}</strong>
                      </span>
                    )}

                    {ord.dispatchDate && (
                      <span className="text-[#6B564C]">
                        Dispatched: {new Date(ord.dispatchDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartLogisticsEdit(ord)}
                    className="text-[#8B3A3A] hover:underline font-bold text-xs flex items-center gap-1 self-start sm:self-center"
                  >
                    <span>{isEditingLogistics ? 'Close Dispatch Editor' : 'Edit Courier / Waybill'}</span>
                  </button>
                </div>

                {/* Inline Courier / Logistics Dispatch Editor */}
                {isEditingLogistics && (
                  <div className="p-4 sm:p-5 bg-white border-t border-[#EADCCE] space-y-3 animate-fadeIn">
                    <h5 className="text-xs font-bold text-[#2B1810] uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#8B3A3A]" />
                      <span>Update Dispatch Courier & Tracking Details</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6B564C] uppercase mb-1">
                          Courier / Delivery Partner
                        </label>
                        <select
                          value={courierInput}
                          onChange={(e) => setCourierInput(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-semibold text-[#2B1810] outline-none"
                        >
                          <option value="Pathao Express Logistics">Pathao Express Logistics</option>
                          <option value="Nepal Post Parcel">Nepal Post Parcel</option>
                          <option value="Sundar Yatayat Cargo & Parcel">Sundar Yatayat Cargo & Parcel</option>
                          <option value="Boutique In-House Rider (Kathmandu)">Boutique In-House Rider (Kathmandu)</option>
                          <option value="FedEx / DHL Express International">FedEx / DHL Express International</option>
                          <option value="Local Pickup at Store">Local Pickup at Store</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6B564C] uppercase mb-1">
                          Tracking # / Waybill Number
                        </label>
                        <input
                          type="text"
                          value={trackingNoInput}
                          onChange={(e) => setTrackingNoInput(e.target.value)}
                          placeholder="e.g. PTH-KTM-9921"
                          className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-mono font-semibold text-[#2B1810] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6B564C] uppercase mb-1">
                        Logistics Internal Dispatch Notes
                      </label>
                      <input
                        type="text"
                        value={logisticsNotesInput}
                        onChange={(e) => setLogisticsNotesInput(e.target.value)}
                        placeholder="e.g. Handed over to rider Bikash at Pulchowk branch, fragile packaging checked."
                        className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs text-[#2B1810] outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingLogisticsId(null)}
                        className="px-3 py-1.5 border border-[#EADCCE] rounded-xl text-xs font-semibold text-[#6B564C]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveLogistics(ord.id, ord.status)}
                        className="px-4 py-1.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold shadow-xs"
                      >
                        Save Logistics Data
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded Full Order Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-[#EADCCE] space-y-4 bg-white animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Delivery Information */}
                      <div className="p-4 bg-[#FAF2E9]/40 rounded-xl border border-[#EADCCE] space-y-2">
                        <span className="text-xs font-bold text-[#8B3A3A] uppercase tracking-wider block">
                          Shipping Address & Contact
                        </span>
                        <p className="text-sm font-bold text-[#2B1810]">{ord.shippingAddress.fullName}</p>
                        <p className="text-xs text-[#6B564C] flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-[#8B3A3A]" /> Primary: {ord.shippingAddress.phone}
                          {ord.shippingAddress.alternatePhone && (
                            <span> | Alt: {ord.shippingAddress.alternatePhone}</span>
                          )}
                        </p>
                        <p className="text-xs text-[#6B564C] flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8B3A3A] shrink-0 mt-0.5" />
                          <span>
                            {ord.shippingAddress.addressLine}, {ord.shippingAddress.city},{' '}
                            {ord.shippingAddress.province || 'Nepal'}
                            {ord.shippingAddress.postalCode && ` (${ord.shippingAddress.postalCode})`}
                          </span>
                        </p>
                        {ord.notes && (
                          <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-200 mt-2">
                            <strong>Customer Note:</strong> {ord.notes}
                          </div>
                        )}
                      </div>

                      {/* Payment & Settlement */}
                      <div className="p-4 bg-[#FAF2E9]/40 rounded-xl border border-[#EADCCE] space-y-2">
                        <span className="text-xs font-bold text-[#8B3A3A] uppercase tracking-wider block">
                          Payment Verification
                        </span>
                        <p className="text-xs text-[#2B1810]">
                          Method: <strong>{ord.paymentMethod.toUpperCase()}</strong>
                        </p>
                        {ord.paymentDetails?.transactionId && (
                          <p className="text-xs font-mono text-[#6B564C]">
                            Ref / Txn ID: <strong>{ord.paymentDetails.transactionId}</strong>
                          </p>
                        )}
                        {ord.paymentDetails?.paidAt && (
                          <p className="text-xs text-[#6B564C]">
                            Paid At: {new Date(ord.paymentDetails.paidAt).toLocaleString()}
                          </p>
                        )}
                        <div className="pt-2 border-t border-[#EADCCE] space-y-1 text-xs">
                          <div className="flex justify-between text-[#6B564C]">
                            <span>Subtotal:</span>
                            <span>{formatPrice(ord.subtotalAmount)}</span>
                          </div>
                          {ord.discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-700">
                              <span>Discount:</span>
                              <span>-{formatPrice(ord.discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-sm text-[#8B3A3A] pt-1 border-t border-[#EADCCE]">
                            <span>Grand Total:</span>
                            <span>{formatPrice(ord.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#6B564C] uppercase tracking-wider block">
                        Ordered Items ({ord.items.length})
                      </span>
                      <div className="divide-y divide-[#FAF2E9] border border-[#EADCCE] rounded-xl overflow-hidden">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={it.product.images[0]}
                                alt={it.product.title.en}
                                className="w-12 h-14 object-cover rounded-lg border border-[#EADCCE] shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <p className="font-bold text-[#2B1810]">{it.product.title.en}</p>
                                <p className="text-[11px] text-[#6B564C]">
                                  Size: <strong className="text-[#8B3A3A]">{it.selectedSize}</strong> | Qty:{' '}
                                  <strong>{it.quantity}</strong>
                                </p>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-sm text-[#8B3A3A]">
                              {formatPrice(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MANUAL ORDER LOG MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#EADCCE] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EADCCE] pb-3">
              <h4 className="font-serif-luxury text-base font-bold text-[#2B1810] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#8B3A3A]" />
                <span>Log New Customer Purchase</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg text-[#6B564C] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualCustomerName}
                    onChange={(e) => setManualCustomerName(e.target.value)}
                    placeholder="e.g. user4484 or Sagar Dawadi"
                    className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-semibold text-[#2B1810] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="9841..."
                    className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-mono font-semibold text-[#2B1810] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">City</label>
                  <select
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-semibold text-[#2B1810] outline-none"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Biratnagar">Biratnagar</option>
                    <option value="Chitwan">Chitwan</option>
                    <option value="Dharan">Dharan</option>
                    <option value="Butwal">Butwal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={manualCourier}
                    onChange={(e) => setManualCourier(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-semibold text-[#2B1810] outline-none"
                  >
                    <option value="Pathao Express Logistics">Pathao Express Logistics</option>
                    <option value="Nepal Post Parcel">Nepal Post Parcel</option>
                    <option value="Sundar Yatayat Cargo & Parcel">Sundar Yatayat Cargo & Parcel</option>
                    <option value="Boutique In-House Rider (Kathmandu)">Boutique In-House Rider</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="e.g. Lazimpat, Near British Embassy"
                  className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs text-[#2B1810] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">
                    Select Product
                  </label>
                  <select
                    value={manualProductId || (products[0]?.id ?? '')}
                    onChange={(e) => setManualProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-semibold text-[#2B1810] outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title.en} (रु {p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B564C] uppercase mb-1">Size</label>
                  <select
                    value={manualSize}
                    onChange={(e) => setManualSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-semibold text-[#2B1810] outline-none"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="Free Size">Free Size</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 border border-[#EADCCE] rounded-xl text-xs font-semibold text-[#6B564C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Add to Logistics Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
