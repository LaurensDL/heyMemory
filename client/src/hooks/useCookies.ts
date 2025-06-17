import { useState, useEffect, useCallback } from 'react';

export type CookieCategories = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export type CookieConsent = {
  hasConsented: boolean;
  categories: CookieCategories;
  consentDate: string;
};

const COOKIE_CONSENT_KEY = 'heymemory-cookie-consent';
const COOKIE_BANNER_DISMISSED_KEY = 'heymemory-banner-dismissed';

const defaultCategories: CookieCategories = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  preferences: false,
};

export function useCookies() {
  const [consent, setConsent] = useState<CookieConsent>({
    hasConsented: false,
    categories: defaultCategories,
    consentDate: '',
  });
  
  const [showBanner, setShowBanner] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const bannerDismissed = localStorage.getItem(COOKIE_BANNER_DISMISSED_KEY);
    
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
      } catch (error) {
        console.error('Failed to parse cookie consent:', error);
      }
    } else if (!bannerDismissed) {
      // Show banner if no consent and banner hasn't been dismissed
      setShowBanner(true);
    }
  }, []);

  const saveConsent = useCallback((categories: CookieCategories) => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      categories: { ...categories, necessary: true }, // Ensure necessary is always true
      consentDate: new Date().toISOString(),
    };
    
    setConsent(newConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(COOKIE_BANNER_DISMISSED_KEY, 'true');
    setShowBanner(false);
    
    // Fire consent events for analytics tracking
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: newConsent
      }));
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }, [saveConsent]);

  const acceptNecessary = useCallback(() => {
    saveConsent(defaultCategories);
  }, [saveConsent]);

  const updateConsent = useCallback((categories: Partial<CookieCategories>) => {
    const newCategories = { ...consent.categories, ...categories, necessary: true };
    saveConsent(newCategories);
  }, [consent.categories, saveConsent]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_BANNER_DISMISSED_KEY);
    setConsent({
      hasConsented: false,
      categories: defaultCategories,
      consentDate: '',
    });
    setShowBanner(true);
  }, []);

  const dismissBanner = useCallback(() => {
    localStorage.setItem(COOKIE_BANNER_DISMISSED_KEY, 'true');
    setShowBanner(false);
  }, []);

  return {
    consent,
    showBanner,
    acceptAll,
    acceptNecessary,
    updateConsent,
    resetConsent,
    dismissBanner,
    hasConsented: consent.hasConsented,
  };
}