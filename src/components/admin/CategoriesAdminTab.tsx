import React, { useState } from 'react';
import { useShopStore } from '../../store/shopStore';
import { Category } from '../../types';
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  ChevronRight,
  Package,
} from 'lucide-react';

interface CategoriesAdminTabProps {
  onShowToast: (msg: string) => void;
  onFilterProductsByCategory?: (categorySlug: string) => void;
}

export const CategoriesAdminTab: React.FC<CategoriesAdminTabProps> = ({
  onShowToast,
  onFilterProductsByCategory,
}) => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategoriesToDefault,
    products,
    language,
  } = useShopStore();

  // Create form state
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameNp, setNewCatNameNp] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDescEn, setNewCatDescEn] = useState('');
  const [newCatDescNp, setNewCatDescNp] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Edit form state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameNp, setEditNameNp] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editDescNp, setEditDescNp] = useState('');
  const [editImage, setEditImage] = useState('');

  // Selected category to inspect sub-products
  const [inspectedCatSlug, setInspectedCatSlug] = useState<string | null>(null);

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditNameEn(cat.name.en);
    setEditNameNp(cat.name.np);
    setEditDescEn(cat.description?.en || '');
    setEditDescNp(cat.description?.np || '');
    setEditImage(cat.image || '');
  };

  const handleSaveEdit = (catId: string) => {
    if (!editNameEn.trim()) {
      alert('Category Heading in English cannot be empty');
      return;
    }
    updateCategory(catId, {
      name: {
        en: editNameEn.trim(),
        np: editNameNp.trim() || editNameEn.trim(),
      },
      description: {
        en: editDescEn.trim(),
        np: editDescNp.trim(),
      },
      image: editImage.trim() || undefined,
    });
    setEditingCatId(null);
    onShowToast(`Updated category heading to "${editNameEn.trim()}"`);
  };

  const handleCancelEdit = () => {
    setEditingCatId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameEn.trim()) {
      alert('Please provide a Category Name in English');
      return;
    }

    const generatedSlug = (newCatSlug.trim() || newCatNameEn.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      slug: generatedSlug,
      name: {
        en: newCatNameEn.trim(),
        np: newCatNameNp.trim() || newCatNameEn.trim(),
      },
      description: {
        en: newCatDescEn.trim() || 'Curated handcrafted boutique collection.',
        np: newCatDescNp.trim() || 'मौलिक नेपाली हातेतान बुटिक संग्रह।',
      },
      image:
        newCatImage.trim() ||
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    };

    addCategory(newCategory);
    onShowToast(`Created new head category "${newCatNameEn.trim()}"!`);

    // Reset form
    setNewCatNameEn('');
    setNewCatNameNp('');
    setNewCatSlug('');
    setNewCatDescEn('');
    setNewCatDescNp('');
    setNewCatImage('');
    setIsAddingNew(false);
  };

  const handleDelete = (cat: Category) => {
    if (cat.slug === 'all' || cat.id === 'all') {
      alert('Cannot delete default "All Collections" category.');
      return;
    }

    const assignedCount = products.filter(
      (p) => p.categoryId === cat.id || p.categoryId === cat.slug
    ).length;

    const confirmed = window.confirm(
      `Delete category "${cat.name.en}"? ${
        assignedCount > 0
          ? `Warning: ${assignedCount} products are currently filed under this category.`
          : ''
      }`
    );

    if (confirmed) {
      deleteCategory(cat.id);
      onShowToast(`Category "${cat.name.en}" removed.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#EADCCE] shadow-xs">
        <div>
          <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2B1810] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#8B3A3A]" />
            <span>Category Headings & Sets Management</span>
          </h3>
          <p className="text-xs text-[#6B564C] mt-0.5">
            Change existing category titles (e.g. Kurthas & Sets, Chyangra Pashmina), add new head categories, and manage sub-product counts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all categories back to default boutique headings?')) {
                resetCategoriesToDefault();
                onShowToast('Restored default category headings');
              }
            }}
            title="Restore default category headings"
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#EADCCE] text-[#6B564C] hover:text-[#8B3A3A] hover:bg-[#FAF2E9] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingNew((prev) => !prev)}
            className="min-h-[44px] px-4 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Head Category</span>
          </button>
        </div>
      </div>

      {/* CREATE NEW CATEGORY FORM */}
      {isAddingNew && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#8B3A3A]/40 shadow-lg space-y-4 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-[#EADCCE] pb-3">
            <h4 className="font-serif-luxury text-base font-bold text-[#2B1810] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Add New Head Category</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-[#6B564C] hover:text-[#8B3A3A] p-1.5 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                  Category Heading (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newCatNameEn}
                  onChange={(e) => {
                    setNewCatNameEn(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Bridal Lehengas & Gowns"
                  className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                  Category Heading (Nepali / नेपाली)
                </label>
                <input
                  type="text"
                  value={newCatNameNp}
                  onChange={(e) => setNewCatNameNp(e.target.value)}
                  placeholder="उदा: विवाह लेहेंगा तथा गाउनहरू"
                  className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                  Category URL Slug
                </label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. bridal-lehengas"
                  className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-mono text-[#2B1810] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                  Banner Photo URL
                </label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-mono text-[#2B1810] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                  Description (English)
                </label>
                <input
                  type="text"
                  value={newCatDescEn}
                  onChange={(e) => setNewCatDescEn(e.target.value)}
                  placeholder="e.g. Handcrafted wedding attire and heritage drapes"
                  className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm text-[#2B1810] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                  Description (Nepali)
                </label>
                <input
                  type="text"
                  value={newCatDescNp}
                  onChange={(e) => setNewCatDescNp(e.target.value)}
                  placeholder="उदा: मौलिक विवाह पहिरन तथा परम्परागत फेसन"
                  className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm text-[#2B1810] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="min-h-[40px] px-4 py-2 border border-[#EADCCE] rounded-xl text-xs font-semibold text-[#6B564C] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[40px] px-5 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORIES LIST */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const isEditing = editingCatId === cat.id;
          const assignedProducts = products.filter(
            (p) => p.categoryId === cat.id || p.categoryId === cat.slug
          );
          const isInspected = inspectedCatSlug === cat.slug;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#EADCCE] p-4 sm:p-5 shadow-xs transition-all hover:border-[#8B3A3A]/40"
            >
              {isEditing ? (
                /* Inline Edit Mode */
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#FAF2E9] pb-2">
                    <span className="text-xs font-bold text-[#8B3A3A] uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editing Category Heading</span>
                    </span>
                    <span className="text-xs font-mono text-[#6B564C]">ID: {cat.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6B564C] uppercase mb-1 block">
                        Category Heading (English) *
                      </label>
                      <input
                        type="text"
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#6B564C] uppercase mb-1 block">
                        Category Heading (Nepali)
                      </label>
                      <input
                        type="text"
                        value={editNameNp}
                        onChange={(e) => setEditNameNp(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6B564C] uppercase mb-1 block">
                        Description (English)
                      </label>
                      <input
                        type="text"
                        value={editDescEn}
                        onChange={(e) => setEditDescEn(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs text-[#2B1810] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#6B564C] uppercase mb-1 block">
                        Banner Image URL
                      </label>
                      <input
                        type="url"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs font-mono text-[#2B1810] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="min-h-[36px] px-3.5 py-1.5 border border-[#EADCCE] rounded-xl text-xs font-semibold text-[#6B564C]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat.id)}
                      className="min-h-[36px] px-4 py-1.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name.en}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EADCCE] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#FAF2E9] border border-[#EADCCE] flex items-center justify-center shrink-0 text-[#8B3A3A]">
                        <Tag className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#2B1810]">
                          {cat.name.en}
                        </h4>
                        {cat.name.np && (
                          <span className="text-xs text-[#8B3A3A] font-semibold bg-[#8B3A3A]/10 px-2 py-0.5 rounded-md">
                            {cat.name.np}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#6B564C] bg-gray-100 px-2 py-0.5 rounded-md">
                          /{cat.slug}
                        </span>
                      </div>

                      {cat.description?.en && (
                        <p className="text-xs text-[#6B564C] mt-0.5 max-w-lg truncate">
                          {cat.description.en}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6B564C]">
                        <span className="font-semibold text-[#8B3A3A]">
                          {assignedProducts.length} sub-products filed
                        </span>
                        {cat.slug !== 'all' && (
                          <button
                            type="button"
                            onClick={() =>
                              setInspectedCatSlug((prev) => (prev === cat.slug ? null : cat.slug))
                            }
                            className="text-[#8B3A3A] hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <span>{isInspected ? 'Hide sub-products' : 'View sub-products'}</span>
                            <ChevronRight
                              className={`w-3 h-3 transform transition-transform ${
                                isInspected ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="min-h-[38px] px-3 py-1.5 bg-[#FAF2E9] hover:bg-[#EADCCE] text-[#2B1810] rounded-xl text-xs font-bold border border-[#EADCCE] flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#8B3A3A]" />
                      <span>Edit Heading</span>
                    </button>

                    {cat.slug !== 'all' && cat.id !== 'all' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        title="Delete category"
                        className="min-h-[38px] p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-products view drawer */}
              {isInspected && (
                <div className="mt-4 pt-3 border-t border-[#FAF2E9] space-y-2 animate-fadeIn">
                  <span className="text-[11px] font-bold text-[#6B564C] uppercase tracking-wider block">
                    Assigned Sub-Products in "{cat.name.en}":
                  </span>

                  {assignedProducts.length === 0 ? (
                    <p className="text-xs text-[#6B564C] italic p-2 bg-[#FAF2E9] rounded-xl">
                      No products are currently filed under this category. Select "{cat.name.en}" in the Product Catalog editor to file products here.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {assignedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 p-2 bg-[#FAF2E9]/60 rounded-xl border border-[#EADCCE]"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title.en}
                            className="w-10 h-12 object-cover rounded-lg border border-[#EADCCE] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#2B1810] truncate">{p.title.en}</p>
                            <p className="text-[11px] font-bold text-[#8B3A3A] font-mono">
                              रु {p.price.toLocaleString('en-US')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
