// MidTrans Configuration
// Keys are loaded from environment variables (.env file)
// See .env.example for required variables
export const MIDTRANS_CONFIG = {
    MERCHANT_ID: import.meta.env.VITE_MIDTRANS_MERCHANT_ID || '',
    CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '',
    SERVER_KEY: import.meta.env.VITE_MIDTRANS_SERVER_KEY || '',

    // Environment
    IS_PRODUCTION: import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',

    // Snap URLs
    SNAP_URL: 'https://app.sandbox.midtrans.com/snap/snap.js',
    SNAP_URL_PRODUCTION: 'https://app.midtrans.com/snap/snap.js',

    // API URLs
    API_URL: 'https://api.sandbox.midtrans.com',
    API_URL_PRODUCTION: 'https://api.midtrans.com',
};

// Get the appropriate Snap URL based on environment
export function getSnapUrl(): string {
    return MIDTRANS_CONFIG.IS_PRODUCTION
        ? MIDTRANS_CONFIG.SNAP_URL_PRODUCTION
        : MIDTRANS_CONFIG.SNAP_URL;
}

// Get the appropriate API URL based on environment
export function getApiUrl(): string {
    return MIDTRANS_CONFIG.IS_PRODUCTION
        ? MIDTRANS_CONFIG.API_URL_PRODUCTION
        : MIDTRANS_CONFIG.API_URL;
}

// Declare Snap global type
declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: MidtransResult) => void;
                    onPending?: (result: MidtransResult) => void;
                    onError?: (result: MidtransResult) => void;
                    onClose?: () => void;
                }
            ) => void;
            embed: (
                token: string,
                options: {
                    embedId: string;
                    onSuccess?: (result: MidtransResult) => void;
                    onPending?: (result: MidtransResult) => void;
                    onError?: (result: MidtransResult) => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}

// MidTrans Result type
export interface MidtransResult {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status?: string;
    va_numbers?: { bank: string; va_number: string }[];
    payment_code?: string;
}

// Transaction request type
export interface TransactionRequest {
    orderId: string;
    grossAmount: number;
    customerDetails: {
        firstName: string;
        lastName?: string;
        email: string;
        phone: string;
    };
    itemDetails: {
        id: string;
        price: number;
        quantity: number;
        name: string;
    }[];
}

// Load Snap.js script dynamically
let snapLoaded = false;
let snapLoadPromise: Promise<void> | null = null;

export function loadSnapScript(): Promise<void> {
    if (snapLoaded) {
        return Promise.resolve();
    }

    if (snapLoadPromise) {
        return snapLoadPromise;
    }

    snapLoadPromise = new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src*="snap.js"]`);
        if (existingScript) {
            snapLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = getSnapUrl();
        script.setAttribute('data-client-key', MIDTRANS_CONFIG.CLIENT_KEY);
        script.async = true;

        script.onload = () => {
            snapLoaded = true;
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load MidTrans Snap script'));
        };

        document.head.appendChild(script);
    });

    return snapLoadPromise;
}

// Simulate backend token generation (in production, this should be a real API call)
export async function createTransaction(request: TransactionRequest): Promise<string> {
    // In a real implementation, this would call your backend API
    // which would then call MidTrans API to get the transaction token

    // For demo purposes, we'll simulate the token generation
    // In production: return await fetch('/api/midtrans/create-transaction', { ... })

    console.log('Creating transaction:', request);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a mock token (in production, this comes from MidTrans API)
    // This is a sample sandbox token format
    const mockToken = `MOCK-${request.orderId}-${Date.now()}`;

    return mockToken;
}

// Open Snap payment popup
export async function openSnapPopup(
    token: string,
    callbacks?: {
        onSuccess?: (result: MidtransResult) => void;
        onPending?: (result: MidtransResult) => void;
        onError?: (result: MidtransResult) => void;
        onClose?: () => void;
    }
): Promise<void> {
    await loadSnapScript();

    if (!window.snap) {
        throw new Error('Snap is not loaded');
    }

    window.snap.pay(token, {
        onSuccess: callbacks?.onSuccess,
        onPending: callbacks?.onPending,
        onError: callbacks?.onError,
        onClose: callbacks?.onClose,
    });
}

// Open Snap embedded mode
export async function openSnapEmbed(
    token: string,
    embedId: string,
    callbacks?: {
        onSuccess?: (result: MidtransResult) => void;
        onPending?: (result: MidtransResult) => void;
        onError?: (result: MidtransResult) => void;
        onClose?: () => void;
    }
): Promise<void> {
    await loadSnapScript();

    if (!window.snap) {
        throw new Error('Snap is not loaded');
    }

    window.snap.embed(token, {
        embedId,
        onSuccess: callbacks?.onSuccess,
        onPending: callbacks?.onPending,
        onError: callbacks?.onError,
        onClose: callbacks?.onClose,
    });
}
