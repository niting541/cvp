/**
 * Flow screen action: navigates to a URL supplied only by Flow configuration (admin-controlled).
 *
 * Security (AppExchange / secure coding):
 * - Navigation targets are validated in urlRedirectUtils (http/https only, or single-slash org paths;
 *   blocks javascript:, data:, credentials-in-URL, control chars, bidi/invisible spoofing, etc.).
 * - Same-tab navigation uses location.assign after FlowNavigationFinishEvent so the Flow runtime
 *   tears down cleanly; new-tab uses window.open(..., 'noopener,noreferrer').
 * - User-visible errors are plain strings rendered with lightning-formatted-text (no raw HTML / DOM injection).
 */
import { LightningElement, api } from 'lwc';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import { resolveNavigationHref } from './urlRedirectUtils';

export default class FlowUrlRedirect extends LightningElement {
    /** Full https URL, http URL, or org-relative path such as /lightning/r/Account/xxx/view */
    @api targetUrl;
    /** True = new tab/window; false or unset = same tab */
    @api openInNewWindow;

    /** Set only from static copy when validation or the browser blocks navigation (never raw user HTML). */
    errorMessage;

    connectedCallback() {
        this.runRedirect();
    }

    useNewWindow() {
        if (this.openInNewWindow === true) {
            return true;
        }
        return false;
    }

    runRedirect() {
        const href = resolveNavigationHref(this.targetUrl, window.location.origin);

        if (!href) {
            this.errorMessage =
                'That link cannot be opened. Use a valid https or http URL (no username or password in the link), or an org path starting with / (for example /lightning/r/Account/001xxx/view).';
            return;
        }

        const newWindow = this.useNewWindow();

        try {
            if (newWindow) {
                const win = window.open(href, '_blank', 'noopener,noreferrer');
                if (win == null) {
                    this.errorMessage =
                        'The browser blocked the new window. Allow popups for this site or set Open in new window to false.';
                    return;
                }
            } else {
                this.dispatchEvent(new FlowNavigationFinishEvent());
                // Macrotask: Flow must finish screen teardown before assign; queueMicrotask
                // runs too early and Lightning/Flow can swallow same-tab navigation.
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                window.setTimeout(() => {
                    window.location.assign(href);
                }, 0);
                return;
            }
        } catch {
            this.errorMessage = 'The browser blocked the redirect. Check popup settings or try again.';
            return;
        }

        this.dispatchEvent(new FlowNavigationFinishEvent());
    }

    handleCloseFlow() {
        this.dispatchEvent(new FlowNavigationFinishEvent());
    }
}