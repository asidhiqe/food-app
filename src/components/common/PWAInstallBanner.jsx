import React, { useState, useEffect } from 'react';
import { Download, X, Bell, Share, PlusSquare, CheckCircle2, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    // Check if already installed as standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // Check if user dismissed recently (don't show for 3 days after dismiss)
    const dismissedAt = localStorage.getItem('sfa_pwa_banner_dismissed');
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 3) return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for native Android/Desktop Chrome install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS, show after 2 seconds if not standalone
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setToastMsg('🎉 App installed! Access directly from your home screen.');
      setTimeout(() => setToastMsg(null), 3500);
    }
    setDeferredPrompt(null);
  };

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        setToastMsg('🔔 Notifications enabled! You will get alerts when lunch is delivered.');
        setTimeout(() => setToastMsg(null), 3500);
        // Dispatch test notification
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: '🎉 Notifications Active!',
            body: 'You will receive real-time updates when meals reach classroom desks.'
          });
        }
      }
    } catch (e) {
      console.log('Notification permission error', e);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('sfa_pwa_banner_dismissed', String(Date.now()));
  };

  if (!showBanner && !toastMsg) return null;

  return (
    <>
      {/* Toast Confirmation */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 999,
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Smart PWA Install & Notification Banner */}
      {showBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '12px',
            right: '12px',
            maxWidth: '480px',
            margin: '0 auto',
            zIndex: 85,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1rem',
              boxShadow: '0 10px 30px rgba(15,23,42,0.4)',
              border: '1px solid rgba(255,255,255,0.12)',
              position: 'relative'
            }}
          >
            {/* Close / Dismiss */}
            <button
              onClick={handleDismiss}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Dismiss"
            >
              <X size={14} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px' }}>
              <img
                src="./bis-hapur-responsive-logo.png"
                alt="App Icon"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  padding: '2px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Install School Food App</span>
                  <span style={{ background: '#2563eb', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    1-Tap Access
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>
                  Instant desk delivery alerts & fast meal re-ordering
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}
              >
                <Download size={14} />
                <span>{isIOS ? 'Add to Home Screen ↗' : 'Install App 📲'}</span>
              </button>

              {notificationStatus !== 'granted' && (
                <button
                  onClick={handleEnableNotifications}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 'var(--radius-full)',
                    padding: '7px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Bell size={13} color="#fde047" />
                  <span>Alerts 🔔</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* iOS "Add to Home Screen" Visual Guide Modal */}
      {showIOSGuide && (
        <div className="modal-overlay" onClick={() => setShowIOSGuide(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '380px', padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}
            >
              <Smartphone size={24} />
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              Install on iPhone / iPad
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.2rem', lineHeight: 1.4 }}>
              Follow these 2 quick steps to add the app to your home screen:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.78rem', flexShrink: 0 }}>
                  1
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
                  Tap the <strong>Share button (⎙ or ↥)</strong> in Safari toolbar.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.78rem', flexShrink: 0 }}>
                  2
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
                  Scroll down and tap <strong>"Add to Home Screen"</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
            >
              Got it, Done!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
