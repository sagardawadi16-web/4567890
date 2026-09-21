import React, { useState } from 'react';
import {
  X,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { Order } from '../../types';

export const CustomerOrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    trackOrderNumber,
    latestOrder,
    language,
    formatPrice,
  } = useShopStore();

  const [searchQuery, setSearchQuery] = useState<string>(
    latestOrder ? latestOrder.orderNumber : ''
  );
  const [foundOrder, setFoundOrder] = useState<Order | null>(latestOrder || null);
  const [searched, setSearched] = useState<boolean>(!!latestOrder);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = trackOrderNumber(searchQuery);
    setFoundOrder(res);
    setSearched(true);
  };

  const getStepStatus = (order: Order, step: number) => {
    // Steps:
    // 1: Order Placed
    // 2: Confirmed / Acknowledged by Atelier
    // 3: Quality Check & Packaged
    // 4: Dispatched / Out for Delivery
    // 5: Delivered
    const isAcknowledged = order.acknowledgedByAdmin;
    const status = order.status;

    if (step === 1) return 'completed';
    if (step === 2) {
      if (isAcknowledged || status !== 'pending') return 'completed';
      return 'active';
    }
    if (step === 3) {
      if (status === 'shipped' || status === 'delivered') return 'completed';
      if (status === 'confirmed' || isAcknowledged) return 'active';
      return 'pending';
    }
    if (step === 4) {
      if (status === 'delivered') return 'completed';
      if (status === 'shipped') return 'active';
      return 'pending';
    }
    if (step === 5) {
      return status === 'delivered' ? 'completed' : 'pending';
    }
    return 'pending';
  };

  return (
    <div
      id="order-tracking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1810]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-[#FFF8F0] w-full max-w-xl rounded-3xl border border-[#EADCCE] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-tracking-title"
      >
        {/* Modal Header */}
        <div className="bg-[#FAF2E9] px-6 py-4 border-b border-[#EADCCE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8B3A3A]/10 flex items-center justify-center text-[#8B3A3A]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 id="order-tracking-title" className="font-serif-luxury text-lg font-bold text-[#2B1810]">
                {language === 'np' ? 'अर्डर ट्र्याकिङ (Order Tracking)' : 'Real-time Order Tracking'}
              </h3>
              <p className="text-xs text-[#6B564C]">
                {language === 'np' ? 'तपाईंको अर्डर कहाँ पुग्यो हेर्नुहोस्' : 'Track live packaging & dispatch status'}
              </p>
            </div>
          </div>
          <button
            id="close-order-tracking-btn"
            onClick={() => setIsOrderTrackingOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B564C] hover:text-[#2B1810] hover:bg-[#EADCCE]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="order-tracking-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'np'
                    ? 'अर्डर नम्बर (उदा. DAW-104921) वा फोन नम्बर...'
                    : 'Order number (e.g. DAW-104921) or phone number...'
                }
                className="w-full bg-white text-[#2B1810] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[#EADCCE] focus:border-[#8B3A3A] focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-[#8B3A3A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8B3A3A] text-white rounded-xl text-xs font-bold hover:bg-[#6e2c2c] transition-colors shrink-0 shadow-xs"
            >
              {language === 'np' ? 'खोज्नुहोस्' : 'Track Order'}
            </button>
          </form>

          {/* Results */}
          {searched && !foundOrder && (
            <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#EADCCE] space-y-2">
              <Package className="w-8 h-8 text-[#6B564C]/50 mx-auto" />
              <p className="text-sm font-semibold text-[#2B1810]">
                {language === 'np'
                  ? `"${searchQuery}" को लागि कुनै अर्डर भेटिएन`
                  : `No order found matching "${searchQuery}"`}
              </p>
              <p className="text-xs text-[#6B564C]">
                {language === 'np'
                  ? 'कृपया अर्डर गर्दा प्राप्त भएको अर्डर नम्बर वा फोन नम्बर पुनः जाँच गर्नुहोस्।'
                  : 'Please double-check your order number or phone number and try again.'}
              </p>
            </div>
          )}

          {foundOrder && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Summary Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#EADCCE] shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {foundOrder.items[0]?.product.images[0] && (
                    <img
                      src={foundOrder.items[0].product.images[0]}
                      alt="Order Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-[#EADCCE]"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#8B3A3A]">
                        {foundOrder.orderNumber}
                      </span>
                      {foundOrder.acknowledgedByAdmin ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {language === 'np' ? 'व्यवस्थापक द्वारा प्रमाणित' : 'Atelier Verified'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          {language === 'np' ? 'प्रमाणीकरण प्रतिक्षा' : 'Awaiting Atelier Review'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B564C] mt-0.5">
                      {foundOrder.customerLoginName
                        ? `Customer: ${foundOrder.customerLoginName}`
                        : `Receiver: ${foundOrder.shippingAddress.fullName}`}
                    </p>
                    <p className="text-xs font-bold text-[#2B1810]">
                      {foundOrder.items.length} {foundOrder.items.length === 1 ? 'item' : 'items'} •{' '}
                      <span className="text-[#8B3A3A] font-bold">
                        {formatPrice(foundOrder.totalAmount)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#6B564C] block">
                    {new Date(foundOrder.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-bold uppercase text-[#2B1810]">
                    {foundOrder.paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADCCE] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
                  {language === 'np' ? 'अर्डर प्रगति अवस्था' : 'Fulfillment Timeline'}
                </h4>

                <div className="relative pl-6 space-y-6 border-l-2 border-[#EADCCE]">
                  {/* Step 1: Placed */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B1810]">
                        {language === 'np' ? '१. अर्डर प्राप्त भयो (Order Placed)' : '1. Order Received'}
                      </p>
                      <p className="text-[11px] text-[#6B564C]">
                        {new Date(foundOrder.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Acknowledged by Admin */}
                  <div className="relative">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                        foundOrder.acknowledgedByAdmin
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-400 text-[#2B1810] animate-pulse'
                      }`}
                    >
                      {foundOrder.acknowledgedByAdmin ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B1810]">
                        {language === 'np'
                          ? '२. बुटिक व्यवस्थापक प्रमाणीकरण (Atelier Verification)'
                          : '2. Atelier Admin Confirmation'}
                      </p>
                      <p className="text-[11px] text-[#6B564C]">
                        {foundOrder.acknowledgedByAdmin
                          ? language === 'np'
                            ? 'व्यवस्थापकले अर्डर स्वीकार गरी तयारीमा पठाइसक्यो।'
                            : 'Order verified by boutique supervisor and sent for packaging.'
                          : language === 'np'
                          ? 'व्यवस्थापकको प्रमाणीकरण प्रतिक्षामा...'
                          : 'Pending manager approval in Admin Panel.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Packaging */}
                  <div className="relative">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        foundOrder.status === 'shipped' || foundOrder.status === 'delivered'
                          ? 'bg-emerald-500 text-white'
                          : foundOrder.acknowledgedByAdmin
                          ? 'bg-[#8B3A3A] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B1810]">
                        {language === 'np' ? '३. गुणस्तर जाँच र प्याकिङ' : '3. Quality Inspection & Packaging'}
                      </p>
                      <p className="text-[11px] text-[#6B564C]">
                        {language === 'np'
                          ? 'साडी तथा कपडाको धागो, बुनाई र फिनिसिङ परीक्षण गरिँदै।'
                          : 'Fabric steam pressed & placed into Dawosti luxury gift box.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Out for Delivery */}
                  <div className="relative">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        foundOrder.status === 'delivered'
                          ? 'bg-emerald-500 text-white'
                          : foundOrder.status === 'shipped'
                          ? 'bg-[#8B3A3A] text-white animate-pulse'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B1810]">
                        {language === 'np' ? '४. डेलिभरीमा हिँड्यो (Out for Delivery)' : '4. Dispatched with Courier'}
                      </p>
                      <p className="text-[11px] text-[#6B564C]">
                        {foundOrder.shippingAddress.city} • Rider will call at +977 {foundOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Rider Note */}
              <div className="p-4 bg-[#FAF2E9] rounded-2xl border border-[#EADCCE] text-xs flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#8B3A3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2B1810]">
                    {foundOrder.shippingAddress.fullName} • {foundOrder.shippingAddress.city},{' '}
                    {foundOrder.shippingAddress.province}
                  </p>
                  <p className="text-[#6B564C] mt-0.5">{foundOrder.shippingAddress.addressLine}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF2E9] px-6 py-3 border-t border-[#EADCCE] flex items-center justify-between text-xs">
          <span className="text-[#6B564C] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Dawosti Kathmandu Guaranteed
          </span>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="px-4 py-1.5 bg-white border border-[#EADCCE] rounded-xl font-bold text-[#2B1810] hover:bg-[#FAF2E9]"
          >
            {language === 'np' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
