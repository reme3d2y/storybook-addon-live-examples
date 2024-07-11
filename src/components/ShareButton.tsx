import React, { FC, ReactNode } from 'react';
import { Spinner } from '@alfalab/core-components/spinner';

import { ActionButton } from './ActionButton';
import { ShareMIcon } from '@alfalab/icons-glyph/ShareMIcon';
import { copyToClipboard } from './utils';
import { share } from './utils/share';
import { CUSTOM_EVENTS, dispatchCustomEvent } from './events';

export type ActionButtonProps = {
    code?: string;
    disabled?: boolean;
    title?: string;
    doneTitle?: string;
};

export const ShareButton: FC<ActionButtonProps> = ({ code, disabled, title, doneTitle }) => {
    const [toastOpen, setToastOpen] = React.useState(false);
    const [toastText, setToastText] = React.useState<ReactNode>('');

    const handleShare = async () => {
        dispatchCustomEvent(CUSTOM_EVENTS.SHARE);

        setToastOpen(true);
        setToastText(<Spinner visible={true} colors='inverted' />);

        try {
            const url = await share(code);
            copyToClipboard(url);
            setToastText(doneTitle);
        } catch (error) {
            setToastText(error.message);
        } finally {
            setTimeout(() => {
                setToastOpen(false);
            }, 500);
        }
    };

    return (
        <ActionButton
            icon={ShareMIcon}
            onClick={() => handleShare()}
            title={title}
            doneTitle={toastText as string}
            disabled={disabled || toastOpen}
            toastProps={{
                autoCloseDelay: 0,
                open: toastOpen,
            }}
        />
    );
};
