import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah currency
 * Returns an object with prefix and value for flexible styling
 */
export function formatRupiah(value: number): { prefix: string; value: string } {
    const formatted = new Intl.NumberFormat('id-ID').format(value);
    return {
        prefix: 'Rp',
        value: formatted,
    };
}

/**
 * Format Rupiah as a single string
 */
export function formatRupiahString(value: number): string {
    const { prefix, value: formatted } = formatRupiah(value);
    return `${prefix} ${formatted}`;
}

/**
 * Format date to Indonesian locale string
 * Example: "12 Oktober 2026"
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format date with time
 * Example: "12 Oktober 2026, 14:30"
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitize(input: string): string {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize HTML content (allows safe HTML)
 */
export function sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input);
}

/**
 * Generate a random order ID
 */
export function generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `EDU-${timestamp}-${random}`;
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if running on mobile device
 */
export function isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
}
