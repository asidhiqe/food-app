import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, User, Users, Copy, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
  if (!isOpen) return null;

  const currentCart = cart || [];
  const currentTotal = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const currentCount = currentCart.reduce((sum, i) => sum + i.quantity, 0);
  const cleanName = activeChild ? activeChild.studentName.split(' ')[0] : 'Your Child';
  const cleanClass = activeChild ? activeChild.class.replace(/Grade\s*/i, '').trim() : '';

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '500px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            background: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: childrenList && childrenList.length > 1 ? '0.75rem' : 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900 }}>🍱 {cleanName}'s Lunch Box</h2>
                {currentCount > 0 && (
                  <span
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}
                  >
                    {currentCount} item{currentCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {activeChild && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Hand-delivered to {cleanName} in Grade {cleanClass}-{activeChild.section}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {currentCart.length > 0 && (
                <button
                  onClick={onClearCart}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px 6px'
                  }}
                >
                  Clear Box
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  padding: '0.35rem',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Child Switcher Tabs inside Cart */}
          {childrenList && childrenList.length > 1 && (
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
              {childrenList.map((kid) => {
                const isSelected = activeChild && activeChild.id === kid.id;
                const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
                const kidItemsCount = kidCart.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <button
                    key={kid.id}
                    onClick={() => onSelectChild(kid)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                      background: isSelected ? 'var(--primary-light)' : '#f8fafc',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}
                  >
                    <span>{kid.gender === 'girl' ? '👧' : '👦'} {kid.studentName.split(' ')[0]}'s Box</span>
                    {kidItemsCount > 0 && (
                      <span
                        style={{
                          background: isSelected ? 'var(--primary)' : '#10b981',
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '8px',
                          fontSize: '0.65rem',
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

        {/* Cart Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {currentCart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🍱</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                {cleanName}'s lunch box is empty
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Add nutritious dishes & fresh snacks from the menu.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Delivery Slot Strip */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Delivering on: </span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedDate}</strong>
                </div>
                <div style={{ background: '#eff6ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.72rem' }}>
                  {selectedSlot?.name || 'Standard Break'}
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {currentCart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.65rem' }}>{item.isVeg ? '🟢' : '🔴'}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {item.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {currency} {item.price} each
                      </div>
                    </div>

                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="stepper-box">
                        <button onClick={() => onRemoveFromCart(item.id)} className="stepper-btn">
                          <Minus size={13} />
                        </button>
                        <span className="stepper-qty">{item.quantity}</span>
                        <button onClick={() => onAddToCart(item)} className="stepper-btn">
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ width: '55px', textAlign: 'right', fontSize: '0.88rem', fontWeight: 900 }}>
                        {currency} {item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sibling 1-Tap Copy Action */}
              {siblings && siblings.length > 0 && (
                <div style={{ background: '#f0fdf4', border: '1px dashed #86efac', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 800, color: '#166534', marginBottom: '0.35rem' }}>
                    <Sparkles size={13} />
                    <span>Quick Pack for Siblings:</span>
                  </div>
                  {siblings.map((sib) => (
                    <div key={sib.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#15803d' }}>
                        Copy {cleanName}'s box for <strong>{sib.studentName.split(' ')[0]}</strong>
                      </span>
                      <button
                        onClick={() => onCopyMealToSibling(sib.id)}
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Copy size={11} />
                        <span>Copy for {sib.studentName.split(' ')[0]}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Multi-Child Family Lunch Box Overview */}
              {hasMultipleKidsWithItems && (
                <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      <span>FAMILY TRAY SUMMARY ({kidsWithItems.length} KIDS)</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#1e40af' }}>
                      {currency} {totalFamilyAmount} Total
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {kidsWithItems.map((kid) => {
                      const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
                      const kidTotal = kidCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                      const isCurrent = activeChild && activeChild.id === kid.id;

                      return (
                        <div
                          key={kid.id}
                          onClick={() => onSelectChild(kid)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: isCurrent ? '#ffffff' : 'rgba(255,255,255,0.7)',
                            border: isCurrent ? '1.5px solid var(--primary)' : '1px solid #dbeafe',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{kid.gender === 'girl' ? '👧' : '👦'}</span>
                            <span style={{ fontWeight: isCurrent ? 900 : 700 }}>{kid.studentName}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({kidCart.length} dishes)</span>
                          </div>
                          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                            {currency} {kidTotal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bill Details */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  marginTop: '0.4rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  BILL SUMMARY
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>{cleanName}'s Box Total</span>
                  <span>{currency} {currentTotal}</span>
                </div>

                {hasMultipleKidsWithItems && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem', color: 'var(--primary)', fontWeight: 700 }}>
                    <span>All {kidsWithItems.length} Kids Combined Total</span>
                    <span>{currency} {totalFamilyAmount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>Classroom Desk Handover</span>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>FREE</span>
                </div>

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
                  <span>{hasMultipleKidsWithItems ? `Pay for All ${kidsWithItems.length} Kids:` : `To Pay for ${cleanName}:`}</span>
                  <span style={{ color: '#059669' }}>{currency} {hasMultipleKidsWithItems ? totalFamilyAmount : currentTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Actions */}
        {(currentCart.length > 0 || totalFamilyCount > 0) && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid var(--border-color)',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
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
                    padding: '0.9rem',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={18} />
                  <span>
                    Pay {currency} {totalFamilyAmount} for All {kidsWithItems.length} Kids (Combined)
                  </span>
                  <ArrowRight size={17} />
                </button>

                {/* 2. SECONDARY SINGLE-CHILD PAYMENT */}
                {currentCart.length > 0 && (
                  <button
                    onClick={() => onProceedToStudent('single')}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
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
                  fontSize: '0.95rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <span>
                  {activeChild ? `Pay ${currency} ${currentTotal} for ${cleanName}'s Lunch` : 'Proceed to Checkout'}
                </span>
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
