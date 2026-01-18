
/**
 * Stripe Service for KitchenBuddy
 * 
 * VIKTIG FOR LANSERING:
 * 1. Logg inn på https://dashboard.stripe.com
 * 2. Gå til "Payment Links" og lag en link for din Pro-plan (f.eks. 99 kr/mnd).
 * 3. Erstatt STRIPE_PAYMENT_LINK nedenfor med din ekte URL.
 */

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_placeholder'; 

export const initiateStripeCheckout = (userId: string) => {
  // client_reference_id lar deg se i Stripe-dashboardet hvilken bruker som har betalt.
  const checkoutUrl = `${STRIPE_PAYMENT_LINK}?client_reference_id=${userId}&success_url=${window.location.origin}?payment=success&cancel_url=${window.location.origin}?payment=cancelled`;
  
  // For en ekte omdirigering i produksjon, fjern kommentaren under:
  // window.location.href = checkoutUrl;
  
  // Simulering for test-formål:
  console.log("Redirecting to Stripe:", checkoutUrl);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

export const checkPaymentStatus = (): 'success' | 'cancelled' | null => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('payment');
  if (status === 'success') return 'success';
  if (status === 'cancelled') return 'cancelled';
  return null;
};

export const clearPaymentParams = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('payment');
  window.history.replaceState({}, '', url.pathname);
};
