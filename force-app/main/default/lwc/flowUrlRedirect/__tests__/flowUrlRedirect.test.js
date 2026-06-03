import { createElement } from 'lwc';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import FlowUrlRedirect from 'c/flowUrlRedirect';

describe('c-flow-url-redirect', () => {
    afterEach(() => {
        jest.clearAllMocks();
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('opens a new window when openInNewWindow is true', () => {
        const openSpy = jest.spyOn(window, 'open').mockReturnValue({});
        const element = createElement('c-flow-url-redirect', { is: FlowUrlRedirect });
        element.targetUrl = 'https://example.com/path';
        element.openInNewWindow = true;

        const finishListener = jest.fn();
        const finishEvent = FlowNavigationFinishEvent.EVENT_NAME || 'lightning__flownavigationfinish';
        element.addEventListener(finishEvent, finishListener);

        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(openSpy).toHaveBeenCalled();
            const [openedUrl] = openSpy.mock.calls[0];
            expect(openedUrl).toMatch(/^https:\/\/example\.com\/path/);
            expect(openSpy.mock.calls[0][1]).toBe('_blank');
            expect(openSpy.mock.calls[0][2]).toBe('noopener,noreferrer');
            expect(finishListener).toHaveBeenCalled();
        });
    });

    it('does not open a new window when openInNewWindow is false', () => {
        const openSpy = jest.spyOn(window, 'open').mockReturnValue({});
        const assignSpy = jest.spyOn(window.location, 'assign').mockImplementation(() => {});

        const element = createElement('c-flow-url-redirect', { is: FlowUrlRedirect });
        element.targetUrl = 'https://example.com/here';
        element.openInNewWindow = false;

        const finishListener = jest.fn();
        const finishEvent = FlowNavigationFinishEvent.EVENT_NAME || 'lightning__flownavigationfinish';
        element.addEventListener(finishEvent, finishListener);

        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                expect(openSpy).not.toHaveBeenCalled();
                expect(finishListener).toHaveBeenCalled();
            })
            .then(
                () =>
                    new Promise((resolve) => {
                        setTimeout(resolve, 0);
                    })
            )
            .then(() => {
                expect(assignSpy).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/example\.com\/here/));
            })
            .finally(() => {
                assignSpy.mockRestore();
            });
    });

    it('does not finish when the URL is invalid', () => {
        const openSpy = jest.spyOn(window, 'open').mockReturnValue({});
        const element = createElement('c-flow-url-redirect', { is: FlowUrlRedirect });
        element.targetUrl = 'javascript:alert(1)';
        element.openInNewWindow = true;

        const finishListener = jest.fn();
        const finishEvent = FlowNavigationFinishEvent.EVENT_NAME || 'lightning__flownavigationfinish';
        element.addEventListener(finishEvent, finishListener);

        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(openSpy).not.toHaveBeenCalled();
            expect(finishListener).not.toHaveBeenCalled();
        });
    });
});
