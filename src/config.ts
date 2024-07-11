import { addons } from '@storybook/manager-api';
import { PrismTheme } from 'prism-react-renderer';

export const LIVE_EXAMPLES_ADDON_ID = 'storybook-addon-live-examples';

export type Config = {
    bgColor?: string;
    previewBgColor?: string;

    borderColor?: string;
    borderRadius?: number;

    errorsBg?: string;
    errorsColor?: string;

    hintColor?: string;

    iconColor?: string;

    viewMismatchBg?: string;

    fontCode?: string;
    fontBase?: string;
    fontSizeCode?: number;
    fontSizeBase?: number;

    sandboxPath?: string;

    mobileFrameName?: string;

    desktopText?: string;
    mobileText?: string;
    expandText?: string;
    copyText?: string;
    shareText?: string;
    resetText?: string;

    copiedText?: string;
    sharedText?: string;

    noMobileText?: string;
    noDesktopText?: string;

    editorTheme?: PrismTheme;
    scope: Record<string, any>;

    shareMode?: 'gist' | 'url';
    githubToken?: string;
};

export const getConfig = () => {
    return addons.getConfig()[LIVE_EXAMPLES_ADDON_ID] as Config;
};

export const configValue = <T extends keyof Config>(key: T, defaultValue: any): Config[T] => {
    return getConfig()[key] || defaultValue;
};
