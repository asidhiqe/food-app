import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, User, Users, Copy, Sparkles, AlertTriangle, CheckCircle2, ShoppingBag, Flame } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartsByChild,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onProceedToStudent,
  selectedDate,
  selectedSlot,
  currency,
  activeChild,
  childrenList,
  onSelectChild,
  onCopyMealToSibling
}) {
  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCart = cart || [];
  const currentTotal = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const currentCount = currentCart.reduce((sum, i) => sum + i.quantity, 0);
  const currentCalories = currentCart.reduce((sum, i) => sum + (Number(i.calories) || 320) * i.quantity, 0);
  const currentProtein = currentCart.reduce((sum, i) => sum + (Number(i.protein) || 8) * i.quantity, 0);
  const cleanName = activeChild ? activeChild.studentName.split(' ')[0] : 'Child';
  const cleanClass = activeChild ? String(activeChild.class || '4').replace(/Grade\s*/i, '').trim() : '';

  // Calculate Family Multi-Child Totals
  const kidsWithItems = (childrenList || []).filter((kid) => {
    const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
    return kidCart.length > 0;
  });

  const totalFamilyAmount = (childrenList || []).reduce((sum, kid) => {
    const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
    return sum + kidCart.reduce((kSum, item) => kSum + item.price * item.quantity, 0);
  }, 0);

  const totalFamilyCount = (childrenList || []).reduce((sum, kid) => {
    const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
    return sum + kidCart.reduce((kSum, item) => kSum + item.quantity, 0);
  }, 0);

  const hasMultipleKidsWithItems = kidsWithItems.length > 1;
  const siblings = (childrenList || []).filter((c) => !activeChild || c.id !== activeChild.id);
  // Only suggest copying to siblings whose lunch tray is currently empty!
  const emptySiblings = siblings.filter(
    (c) => ((cartsByChild && cartsByChild[c.id]) || []).length === 0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: '20px',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* 1. Header (Clean single-line title + compact controls) */}
        <div
          style={{
            padding: '1rem 1.2rem',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: childrenList && childrenList.length > 1 ? '0.75rem' : 0 }}>
            {/* Left: Title & Child Identity */}
            <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '1.08rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cleanName}'s Lunch Tray
                </h2>
                {currentCount > 0 && (
                  <span
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {currentCount} item{currentCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Class {cleanClass}-{activeChild?.section} • ID: {activeChild?.id}
              </p>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {currentCart.length > 0 && (
                <button
                  onClick={onClearCart}
                  title="Clear Box"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              )}
              <button
                onClick={onClose}
                title="Close (Esc)"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Sibling Switcher Tabs inside Cart */}
          {childrenList && childrenList.length > 1 && (
            <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {childrenList.map((kid) => {
                const isSelected = activeChild && activeChild.id === kid.id;
                const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
                const kidItemsCount = kidCart.reduce((sum, i) => sum + i.quantity, 0);
                const kidFirstName = kid.studentName.split(' ')[0];

                return (
                  <button
                    key={kid.id}
                    onClick={() => onSelectChild(kid)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? 'none' : '1px solid #e2e8f0',
                      background: isSelected ? '#0f172a' : '#f8fafc',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.74rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      flexShrink: 0,
                      boxShadow: isSelected ? '0 2px 8px rgba(15,23,42,0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {kid.photo ? (
                      <img
                        src={kid.photo}
                        alt={kidFirstName}
                        style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={12} />
                    )}
                    <span>{kidFirstName}'s Box</span>
                    {kidItemsCount > 0 && (
                      <span
                        style={{
                          background: isSelected ? '#16a34a' : '#10b981',
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '8px',
                          fontSize: '0.62rem',
                          fontWeight: 900
                        }}
                      >
                        {kidItemsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Cart Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.2rem' }}>
          {currentCart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <ShoppingBag size={44} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {cleanName}'s lunch box is empty
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Add wholesome dishes & snacks from the campus canteen.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Delivery Slot Strip */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.55rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Delivering on: </span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedDate || 'Today'}</strong>
                </div>
                <div style={{ background: '#eff6ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.72rem' }}>
                  {selectedSlot?.name?.split('/')[0]?.trim() || 'Standard Break'}
                </div>
              </div>

              {/* Meal Energy & Nutrition Summary Bar */}
              {currentCart.length > 0 && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                    border: '1px solid #fde68a',
                    borderRadius: '12px',
                    padding: '0.55rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={14} color="#d97706" />
                      <span>Meal Energy:</span>
                    </span>
                    <strong style={{ color: '#78350f' }}>{currentCalories} kcal</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid #fcd34d' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803d' }}>💪 {currentProtein}g Protein</span>
                  </div>
                </div>
              )}

              {/* Dish Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentCart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Left: Dish Name & Price */}
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            border: `1.5px solid ${item.isVeg ? '#16a34a' : '#dc2626'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '2px',
                            flexShrink: 0
                          }}
                        >
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: item.isVeg ? '#16a34a' : '#dc2626' }} />
                        </div>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {item.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, marginTop: '2px', marginLeft: '16px' }}>
                        {currency} {item.price * item.quantity}
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '4px' }}>
                            ({currency} {item.price} × {item.quantity})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Standard Design System Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div className="app-stepper">
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="app-stepper-btn"
                          title="Remove item"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="app-stepper-qty">{item.quantity}</span>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="app-stepper-btn app-stepper-btn-add"
                          title="Add more"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sibling 1-Tap Copy Action (Only shown for siblings with empty trays) */}
              {emptySiblings && emptySiblings.length > 0 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.65rem 0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 800, color: '#166534', marginBottom: '0.35rem' }}>
                    <Sparkles size={13} />
                    <span>Quick Pack for Empty Trays:</span>
                  </div>
                  {emptySiblings.map((sib) => {
                    const sibName = sib.studentName.split(' ')[0];
                    return (
                      <div key={sib.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#15803d' }}>
                          Pack same meal for <strong>{sibName}</strong>
                        </span>
                        <button
                          onClick={() => onCopyMealToSibling(sib)}
                          style={{
                            background: '#ffffff',
                            color: '#166534',
                            border: '1px solid #86efac',
                            padding: '3px 9px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Copy size={10} />
                          <span>Copy for {sibName}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Unified Order Summary Card */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                  <span>{hasMultipleKidsWithItems ? `FAMILY TRAY BREAKDOWN (${kidsWithItems.length} KIDS)` : 'ORDER SUMMARY'}</span>
                </div>

                {hasMultipleKidsWithItems ? (
                  /* Itemized Sibling Rows (Clickable to switch child) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    {kidsWithItems.map((kid) => {
                      const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
                      const kidTotal = kidCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                      const isCurrent = activeChild && activeChild.id === kid.id;
                      const kidFirstName = kid.studentName.split(' ')[0];

                      return (
                        <div
                          key={kid.id}
                          onClick={() => onSelectChild(kid)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: isCurrent ? '#ffffff' : 'rgba(255,255,255,0.7)',
                            border: isCurrent ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.76rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {kid.photo ? (
                              <img src={kid.photo} alt={kidFirstName} style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <User size={13} />
                            )}
                            <span style={{ fontWeight: isCurrent ? 900 : 700, color: 'var(--text-main)' }}>{kid.studentName}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({kidCart.length} dishes)</span>
                          </div>
                          <span style={{ fontWeight: 900, color: 'var(--text-main)' }}>
                            {currency} {kidTotal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Single Child Summary Line */
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                    <span>{cleanName}'s Box Total</span>
                    <span style={{ fontWeight: 800 }}>{currency} {currentTotal}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    borderTop: '1px dashed #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 900
                  }}
                >
                  <span>{hasMultipleKidsWithItems ? `Total for All ${kidsWithItems.length} Kids:` : `To Pay:`}</span>
                  <span style={{ color: '#059669' }}>{currency} {hasMultipleKidsWithItems ? totalFamilyAmount : currentTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Footer Checkout Actions */}
        {(currentCart.length > 0 || totalFamilyCount > 0) && (
          <div
            style={{
              padding: '0.9rem 1.2rem',
              borderTop: '1px solid #e2e8f0',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              flexShrink: 0
            }}
          >
            {hasMultipleKidsWithItems ? (
              /* DUAL CTA FOR MULTIPLE KIDS */
              <>
                {/* 1. PRIMARY COMBINED 1-TAP PAYMENT */}
                <button
                  onClick={() => onProceedToStudent('all')}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.92rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={16} />
                  <span>
                    Pay {currency} {totalFamilyAmount} for All {kidsWithItems.length} Kids (Combined)
                  </span>
                  <ArrowRight size={16} />
                </button>

                {/* 2. SECONDARY SINGLE-CHILD PAYMENT */}
                {currentCart.length > 0 && (
                  <button
                    onClick={() => onProceedToStudent('single')}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Pay Only for {cleanName}'s Box ({currency} {currentTotal})</span>
                  </button>
                )}
              </>
            ) : (
              /* SINGLE CHILD PAYMENT */
              <button
                onClick={() => onProceedToStudent('single')}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.92rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <span>
                  {activeChild ? `Pay ${currency} ${currentTotal} for ${cleanName}'s Lunch` : 'Proceed to Checkout'}
                </span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
