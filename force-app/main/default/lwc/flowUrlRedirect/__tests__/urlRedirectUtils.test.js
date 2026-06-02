import { resolveNavigationHref } from '../urlRedirectUtils';

const ORIGIN = 'https://example.my.salesforce.com';

describe('resolveNavigationHref', () => {
    it('returns null for empty or non-string input', () => {
        expect(resolveNavigationHref(undefined, ORIGIN)).toBeNull();
        expect(resolveNavigationHref(null, ORIGIN)).toBeNull();
        expect(resolveNavigationHref('', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('   ', ORIGIN)).toBeNull();
        expect(resolveNavigationHref(123, ORIGIN)).toBeNull();
    });

    it('allows https and http without credentials', () => {
        expect(resolveNavigationHref('https://vendor.example/path?q=1', ORIGIN)).toBe(
            'https://vendor.example/path?q=1'
        );
        expect(resolveNavigationHref('http://legacy.example/', ORIGIN)).toBe('http://legacy.example/');
    });

    it('resolves org-relative paths against base origin', () => {
        expect(resolveNavigationHref('/lightning/r/Account/001xx/view', ORIGIN)).toBe(
            'https://example.my.salesforce.com/lightning/r/Account/001xx/view'
        );
    });

    it('rejects protocol-relative and non-http(s) schemes', () => {
        expect(resolveNavigationHref('//evil.example/', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('javascript:alert(1)', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('data:text/html,<script>bad</script>', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('ftp://files.example/', ORIGIN)).toBeNull();
    });

    it('rejects embedded credentials', () => {
        expect(resolveNavigationHref('https://user:pass@host/', ORIGIN)).toBeNull();
    });

    it('rejects control characters, bidi spoofing, invisible chars, and backslashes', () => {
        expect(resolveNavigationHref('https://a.com/\n', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('https://a.com\u202eb.com', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('https://a.com\u200bb.com', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('https://a.com\\b.com', ORIGIN)).toBeNull();
        expect(resolveNavigationHref('/lightning/o\\home', ORIGIN)).toBeNull();
    });

    it('rejects oversized input', () => {
        const long = 'a'.repeat(8001);
        expect(resolveNavigationHref(long, ORIGIN)).toBeNull();
    });

    it('returns null when base origin is missing for relative paths', () => {
        expect(resolveNavigationHref('/lightning/page/home', '')).toBeNull();
        expect(resolveNavigationHref('/lightning/page/home', null)).toBeNull();
    });
});
