import { CookieCategories } from "@/hooks/useCookies";

// Generic cookie utility functions
export function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax`;
}

// Cookie consent specific functions
export function shouldLoadAnalytics(consent: CookieCategories): boolean {
  return consent.analytics;
}

export function shouldLoadMarketing(consent: CookieCategories): boolean {
  return consent.marketing;
}

export function shouldLoadPreferences(consent: CookieCategories): boolean {
  return consent.preferences;
}

// Initialize analytics based on consent
export function initializeAnalytics(consent: CookieCategories) {
  if (shouldLoadAnalytics(consent)) {
    // Initialize Google Analytics or other analytics
    console.log('Analytics initialized with consent');
    
    // Example: Initialize Google Analytics 4
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   cookie_flags: 'SameSite=Lax;Secure'
    // });
  }
}

export function initializeMarketing(consent: CookieCategories) {
  if (shouldLoadMarketing(consent)) {
    // Initialize marketing pixels, Facebook Pixel, etc.
    console.log('Marketing tools initialized with consent');
    
    // Example: Initialize Facebook Pixel
    // fbq('init', 'FACEBOOK_PIXEL_ID');
  }
}

export function initializePreferences(consent: CookieCategories) {
  if (shouldLoadPreferences(consent)) {
    // Initialize preference cookies for personalization
    console.log('Preference cookies enabled');
    
    // Load user preferences, theme settings, etc.
    const savedTheme = getCookie('user-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }
}

// Clean up cookies when consent is withdrawn
export function cleanupCookies(previousConsent: CookieCategories, newConsent: CookieCategories) {
  // Remove analytics cookies if consent withdrawn
  if (previousConsent.analytics && !newConsent.analytics) {
    // Remove Google Analytics cookies
    deleteCookie('_ga');
    deleteCookie('_ga_*');
    deleteCookie('_gid');
    deleteCookie('_gat');
    console.log('Analytics cookies removed');
  }
  
  // Remove marketing cookies if consent withdrawn
  if (previousConsent.marketing && !newConsent.marketing) {
    // Remove Facebook Pixel cookies
    deleteCookie('_fbp');
    deleteCookie('_fbc');
    console.log('Marketing cookies removed');
  }
  
  // Remove preference cookies if consent withdrawn
  if (previousConsent.preferences && !newConsent.preferences) {
    deleteCookie('user-theme');
    deleteCookie('user-language');
    deleteCookie('user-preferences');
    console.log('Preference cookies removed');
  }
}

// Listen for consent updates and reinitialize services
export function setupConsentListener() {
  if (typeof window !== 'undefined') {
    window.addEventListener('cookieConsentUpdated', (event: any) => {
      const { detail: consent } = event;
      
      // Initialize services based on new consent
      initializeAnalytics(consent.categories);
      initializeMarketing(consent.categories);
      initializePreferences(consent.categories);
      
      console.log('Cookie consent updated:', consent);
    });
  }
}