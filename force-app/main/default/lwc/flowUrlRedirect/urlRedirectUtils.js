const MAX_LEN = 8000;

/** Bidirectional override characters that can spoof how a URL appears in UI. */
const BIDI_SPOOF = /[\u202a-\u202e]/;

/** Zero-width and format characters that can hide or alter visible URL text. */
const INVISIBLE_FORMAT = /[\u200b-\u200d\ufeff]/;

/**
 * Resolves a safe navigation href for Flow-driven redirects (admin-controlled input).
 * - Absolute: http or https only, no embedded credentials (blocks javascript:, data:, etc.).
 * - Internal Lightning-style: path starting with a single "/" (not "//"), resolved against baseOrigin.
 * - Rejects control characters, backslashes, overlong strings, and common URL obfuscation tricks.
 *
 * @param {string} [raw]
 * @param {string} baseOrigin Current window origin (e.g. https://myorg.lightning.force.com)
 * @returns {string | null} Absolute href, or null if disallowed
 */
export function resolveNavigationHref(raw, baseOrigin) {
    if (!raw || typeof raw !== 'string') {
        return null;
    }
    const trimmed = raw.trim();
    if (!trimmed || trimmed.length > MAX_LEN) {
        return null;
    }
    if (/[\r\n\0]/.test(trimmed) || BIDI_SPOOF.test(trimmed) || INVISIBLE_FORMAT.test(trimmed)) {
        return null;
    }
    if (trimmed.includes('\\')) {
        return null;
    }

    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
        if (!baseOrigin || typeof baseOrigin !== 'string' || baseOrigin.length === 0) {
            return null;
        }
        try {
            return new URL(trimmed, baseOrigin).href;
        } catch {
            return null;
        }
    }

    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return null;
        }
        if (parsed.username || parsed.password) {
            return null;
        }
        return parsed.href;
    } catch {
        return null;
    }
}