import { IconButton, IconButtonProps } from '@alfalab/core-components/icon-button';
import { Toast, ToastProps } from '@alfalab/core-components/toast';
import { styled } from '@storybook/theming';
import React, { FC, forwardRef, useState } from 'react';
import { configValue } from '../config';

export type ActionButtonProps = IconButtonProps & {
    onClick?: () => void;
    active?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
    doneTitle?: string;
    toastProps?: Partial<ToastProps>;
};

const Button = styled(IconButton)<ActionButtonProps>(
    ({ theme }) => `
    &.active {
        color: ${configValue('iconColor', '#000')};
    }
`,
);

export const ActionButton: FC<ActionButtonProps> = forwardRef(
    ({ icon, onClick, active, title, doneTitle, toastProps, ...restProps }, ref) => {
        const [open, setOpen] = useState(false);

        const handleClick = () => {
            if (doneTitle) setOpen(true);
            onClick();
        };

        return (
            <>
                {Boolean(doneTitle) && (
                    <Toast
                        open={open}
                        position='bottom-end'
                        offset={[0, 100]}
                        badge={null}
                        title={doneTitle}
                        hasCloser={false}
                        block={false}
                        onClose={() => setOpen(false)}
                        autoCloseDelay={1500}
                        style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    />
                )}

                <Button
                    type='button'
                    size='s'
                    view='secondary'
                    onClick={handleClick}
                    className={active && 'active'}
                    icon={icon}
                    ref={ref}
                    title={title}
                    {...restProps}
                />
            </>
        );
    },
);
