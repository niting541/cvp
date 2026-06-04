const MAX_LEN = 8000;

/** Bidirectional override characters that can spoof how a URL appears in UI. */
const BIDI_SPOOF = /[\u202a-\u202e]/;

/** Zero-width and format characters that can hide or alter visible URL text. */
const INVISIBLE_FORMAT = /[\u200b-\u200d\ufeff]/;

/**
 * C0/C1-style controls and Unicode line/paragraph separators (not covered by trim()).
 * Rejecting these avoids parser/UI ambiguity; legitimate URLs do not contain raw controls.
 */
const DISALLOWED_CONTROLS = /[\0\r\n\u000b\u000c\u2028\u2029]/;

/**
 * Resolves a safe navigation href for Flow-driven redirects (admin-controlled input).
 * - Absolute: http or https only, no embedded credentials (blocks javascript:, data:, etc.).
 * - Internal Lightning-style: path starting with a single "/" (not "//"), resolved against baseOrigin;
 *   resolved URL must stay on the same origin as baseOrigin.
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
    if (DISALLOWED_CONTROLS.test(trimmed) || BIDI_SPOOF.test(trimmed) || INVISIBLE_FORMAT.test(trimmed)) {
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
            const resolved = new URL(trimmed, baseOrigin);
            const base = new URL(baseOrigin);
            // Defense in depth: relative input must not resolve off the org origin (parser quirks).
            if (resolved.origin !== base.origin) {
                return null;
            }
            return resolved.href;
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