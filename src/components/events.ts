export const CUSTOM_EVENTS = {
    VIEW_CHANGE: 'view-change',
    COPY: 'copy',
    SHOW_SOURCE_CODE: 'show-source-code',
    SHARE: 'share',
    REFRESH: 'refresh',
} as const;

export function dispatchCustomEvent(
    eventName: typeof CUSTOM_EVENTS[keyof typeof CUSTOM_EVENTS],
    data?: any,
) {
    document.dispatchEvent(
        new CustomEvent(eventName, {
            detail: data,
            bubbles: true,
        }),
    );
}
