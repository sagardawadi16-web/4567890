import React, { useState } from 'react';
import {
  Mail,
  Send,
  Users,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Search,
  Download,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { buildNewProductEmailContent, buildMailtoUrl } from '../../services/emailService';

export const SubscribersEmailDropsTab: React.FC = () => {
  const {
    products,
    formatPrice,
    emailSubscribers,
    subscribeEmail,
    deleteSubscriber,
    emailCampaigns,
    sendNewProductEmailCampaign,
  } = useShopStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAllEmails, setCopiedAllEmails] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [addMsg, setAddMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [blastSuccessMsg, setBlastSuccessMsg] = useState<string | null>(null);

  const activeSubscribers = emailSubscribers.filter((s) => s.status === 'active');
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const emailPreview = selectedProduct
    ? buildNewProductEmailContent(selectedProduct)
    : null;

  const mailtoUrl = emailPreview
    ? buildMailtoUrl(
        activeSubscribers.map((s) => s.email),
        emailPreview.subject,
        emailPreview.bodyText
      )
    : '';

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const res = subscribeEmail(newEmail.trim(), 'admin_manual', newName.trim());
    if (res.success) {
      setAddMsg({ type: 'success', text: res.message });
      setNewEmail('');
      setNewName('');
      setTimeout(() => setAddMsg(null), 4000);
    } else {
      setAddMsg({ type: 'error', text: res.message });
    }
  };

  const handleDispatchBlast = () => {
    if (!selectedProduct) return;
    const { campaign, recipientCount } = sendNewProductEmailCampaign(selectedProduct);
    setBlastSuccessMsg(
      `Email blast recorded! Sent "${campaign.subject}" to ${recipientCount} active VIP subscriber(s).`
    );
    setTimeout(() => setBlastSuccessMsg(null), 6000);
  };

  const handleCopyAllEmails = () => {
    const list = activeSubscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(list);
    setCopiedAllEmails(true);
    setTimeout(() => setCopiedAllEmails(false), 2500);
  };

  const handleCopyBody = () => {
    if (!emailPreview) return;
    navigator.clipboard.writeText(emailPreview.bodyText);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2500);
  };

  const handleCopySubject = () => {
    if (!emailPreview) return;
    navigator.clipboard.writeText(emailPreview.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2500);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Email,Name,SubscribedAt,Source,Status\n';
    const rows = emailSubscribers
      .map(
        (s) =>
          `"${s.id}","${s.email}","${s.name || ''}","${s.subscribedAt}","${s.source}","${s.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dawosti_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = emailSubscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EADCCE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#8B3A3A]/10 text-[#8B3A3A] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2B1810]">
              {activeSubscribers.length}
            </div>
            <div className="text-xs font-semibold text-[#6B564C] uppercase tracking-wider">
              Active VIP Subscribers
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EADCCE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#8B3A3A] flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2B1810]">
              {emailCampaigns.length}
            </div>
            <div className="text-xs font-semibold text-[#6B564C] uppercase tracking-wider">
              Drop Campaigns Sent
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EADCCE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#2B1810] truncate max-w-[180px]">
              contact.dawosti@gmail.com
            </div>
            <div className="text-[11px] font-semibold text-[#6B564C]">
              Official Sender & Hotline: 9708251494
            </div>
          </div>
        </div>
      </div>

      {blastSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{blastSuccessMsg}</span>
        </div>
      )}

      {/* 2. Product Drop Email Announcement Studio */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EADCCE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADCCE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif-luxury text-lg font-bold text-[#2B1810]">
                "Hey, we are selling this!" Launch Email Dispatcher
              </h3>
            </div>
            <p className="text-xs text-[#6B564C] mt-1">
              Select any piece to preview and dispatch instant email drop notifications to all {activeSubscribers.length} subscriber(s).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllEmails}
              disabled={activeSubscribers.length === 0}
              className="px-3 py-1.5 bg-[#FAF2E9] hover:bg-[#F3E5D8] border border-[#EADCCE] text-[#2B1810] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copiedAllEmails ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Emails!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy BCC List ({activeSubscribers.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-2">
              Select Product to Feature in Drop Email:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs sm:text-sm text-[#2B1810] focus:ring-1 focus:ring-[#8B3A3A] min-h-[44px]"
            >
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.title.en} — {formatPrice(prod.price)} ({prod.categoryId})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDispatchBlast}
              disabled={!selectedProduct || activeSubscribers.length === 0}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#8B3A3A] hover:bg-[#722E2E] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast to {activeSubscribers.length} VIPs</span>
            </button>
          </div>
        </div>

        {/* Live Email Preview Container */}
        {selectedProduct && emailPreview && (
          <div className="bg-[#FAF2E9]/60 border border-[#EADCCE] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADCCE] pb-3">
              <div className="text-xs">
                <span className="font-bold text-[#6B564C] uppercase">Subject Line: </span>
                <span className="font-medium text-[#2B1810] bg-white px-2 py-0.5 rounded border border-[#EADCCE] ml-1">
                  {emailPreview.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySubject}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#6B564C] hover:text-[#2B1810] bg-white border border-[#EADCCE] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedSubject ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
                </button>
                <button
                  onClick={handleCopyBody}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#6B564C] hover:text-[#2B1810] bg-white border border-[#EADCCE] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedBody ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBody ? 'Copied' : 'Copy Email Body'}</span>
                </button>
                {mailtoUrl && (
                  <a
                    href={mailtoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-[11px] font-bold text-[#FFF8F0] bg-[#8B3A3A] hover:bg-[#722E2E] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in Mail App</span>
                  </a>
                )}
              </div>
            </div>

            {/* Email Body Visual Mockup */}
            <div className="bg-white border border-[#EADCCE] rounded-xl p-5 shadow-xs max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-serif-luxury text-base font-bold tracking-widest text-[#8B3A3A] uppercase">
                  DAWOSTI ATELIER
                </span>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#8B3A3A] px-2 py-0.5 rounded-full font-bold">
                  NEW ARRIVAL DROP
                </span>
              </div>

              <div className="text-xs text-[#2B1810] space-y-3 leading-relaxed">
                <p className="font-semibold text-sm text-[#8B3A3A]">
                  Hey, we are selling this! ✨
                </p>
                <p>
                  Exciting news from DAWOSTI Atelier in Kathmandu! A fresh handcrafted piece has just been listed in our boutique:
                </p>

                <div className="bg-[#FAF2E9] border border-[#EADCCE] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                  {selectedProduct.images?.[0] && (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title.en}
                      className="w-24 h-32 object-cover rounded-lg shadow-xs shrink-0"
                    />
                  )}
                  <div className="space-y-1 text-left w-full">
                    <h4 className="font-serif-luxury text-base font-bold text-[#2B1810]">
                      {selectedProduct.title.en}
                    </h4>
                    <p className="text-xs text-[#6B564C] italic">
                      {selectedProduct.description.en}
                    </p>
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-[#8B3A3A]">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6B564C]">
                  Direct inquiries & orders: WhatsApp / Call <span className="font-bold text-[#2B1810]">+977 9708251494</span> or email <span className="font-bold text-[#2B1810]">contact.dawosti@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Subscribers Roster & Manual Add */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EADCCE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADCCE] pb-4">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#2B1810]">
              VIP Email Subscribers Directory ({emailSubscribers.length})
            </h3>
            <p className="text-xs text-[#6B564C]">
              Customers who opted in via the website footer, checkout, or manual boutique registration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 bg-[#FAF2E9] hover:bg-[#F3E5D8] border border-[#EADCCE] text-[#2B1810] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Add Subscriber Form */}
        <form
          onSubmit={handleAddSubscriber}
          className="bg-[#FAF2E9]/70 border border-[#EADCCE] rounded-2xl p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#6B564C] uppercase tracking-wider">
            <Plus className="w-3.5 h-3.5 text-[#8B3A3A]" />
            <span>Manually Add New Subscriber</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="customer@email.com"
              className="px-3.5 py-2 bg-white border border-[#EADCCE] rounded-xl text-xs sm:text-sm text-[#2B1810] focus:ring-1 focus:ring-[#8B3A3A] min-h-[40px]"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Customer Name (Optional)"
              className="px-3.5 py-2 bg-white border border-[#EADCCE] rounded-xl text-xs sm:text-sm text-[#2B1810] focus:ring-1 focus:ring-[#8B3A3A] min-h-[40px]"
            />
            <button
              type="submit"
              className="min-h-[40px] px-4 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add to VIP List</span>
            </button>
          </div>

          {addMsg && (
            <p
              className={`text-xs ${
                addMsg.type === 'success' ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {addMsg.text}
            </p>
          )}
        </form>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscribers by email or name..."
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-[#EADCCE] rounded-xl text-xs sm:text-sm text-[#2B1810] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
          />
        </div>

        {/* Subscribers Table */}
        <div className="border border-[#EADCCE] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF2E9] text-[#6B564C] uppercase text-[10px] font-bold tracking-wider border-b border-[#EADCCE]">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Subscribed Date</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADCCE] bg-white">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">
                      No subscribers found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#FAF2E9]/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#2B1810] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{sub.email}</span>
                      </td>
                      <td className="px-4 py-3 text-[#6B564C]">
                        {sub.name || <span className="text-gray-300 italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[#6B564C]">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                          {sub.source.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteSubscriber(sub.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Drop Campaigns Sent History */}
      {emailCampaigns.length > 0 && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EADCCE] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EADCCE] pb-3">
            <Clock className="w-4 h-4 text-[#8B3A3A]" />
            <h3 className="font-serif-luxury text-base font-bold text-[#2B1810]">
              Sent Launch Campaigns History ({emailCampaigns.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {emailCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-3.5 bg-[#FAF2E9]/60 border border-[#EADCCE] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#2B1810] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{camp.subject}</span>
                  </div>
                  <div className="text-[11px] text-[#6B564C] flex items-center gap-3">
                    <span>Product: {camp.productName}</span>
                    <span>•</span>
                    <span>Recipients: {camp.recipientCount}</span>
                    <span>•</span>
                    <span>{new Date(camp.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Dispatched
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
