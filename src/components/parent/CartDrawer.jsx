import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, User, Users, Copy, Sparkles, AlertTriangle } from 'lucide-react';

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

  const siblings = (childrenList || []).filter((c) => !activeChild || c.id !== activeChild.id);

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
                  Clear
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
                    <span>👦 {kid.studentName.split(' ')[0]}'s Box</span>
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
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)' }}>DELIVERY SLOT</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{selectedSlot?.name} ({selectedDate})</div>
                </div>
                <div style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  Desk Delivery (Grade {cleanClass}-{activeChild?.section})
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
                      padding: '0.6rem 0',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          border: `1.5px solid ${item.isVeg ? '#16a34a' : '#dc2626'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '2px',
                          flexShrink: 0
                        }}
                      >
                        <div
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: item.isVeg ? '#16a34a' : '#dc2626'
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {currency} {item.price} each
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="quantity-control">
                        <button className="qty-btn" onClick={() => onRemoveFromCart(item.id)}>
                          <Minus size={12} />
                        </button>
                        <span className="qty-count">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => onAddToCart(item)}>
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ minWidth: '54px', textAlign: 'right', fontWeight: 800, fontSize: '0.85rem' }}>
                        {currency} {item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sibling Duplicate Meal Helper */}
              {siblings.length > 0 && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                    border: '1px solid #f0abfc',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.3rem' }}>
                    <Sparkles size={14} color="#c026d3" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#86198f' }}>
                      Pack this same meal for sibling?
                    </span>
                  </div>

                  {siblings.map((sib) => (
                    <div
                      key={sib.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '0.3rem'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#701a75' }}>
                        👧 {sib.studentName} (Grade {sib.class.replace(/Grade\s*/i, '').trim()}-{sib.section})
                      </span>
                      <button
                        onClick={() => onCopyMealToSibling(sib)}
                        style={{
                          background: '#86198f',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          padding: '3px 8px',
                          fontSize: '0.7rem',
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
                  <span>Item Total</span>
                  <span>{currency} {currentTotal}</span>
                </div>

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
                  <span>To Pay for {cleanName}'s Lunch:</span>
                  <span>{currency} {currentTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Proceed Button */}
        {currentCart.length > 0 && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid var(--border-color)',
              background: '#ffffff'
            }}
          >
            <button
              onClick={onProceedToStudent}
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
          </div>
        )}
      </div>
    </div>
  );
}
