import { IconButton, IconButtonProps } from '@alfalab/core-components/icon-button';
import { Tooltip, TooltipProps } from '@alfalab/core-components/tooltip';
import { styled } from '@storybook/theming';
import React, { ButtonHTMLAttributes, FC, forwardRef, ReactNode, useState } from 'react';
import { configValue } from '../config';

export type ActionButtonProps = IconButtonProps & {
    onClick?: () => void;
    active?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
    doneTitle?: string;
    tooltipProps?: Partial<TooltipProps>;
};

const Button = styled(IconButton)<ActionButtonProps>(
    ({ theme }) => `
    &.active {
        color: ${configValue('iconColor', '#000')};
    }
`,
);

export const ActionButton: FC<ActionButtonProps> = forwardRef(
    ({ icon, onClick, active, title, doneTitle, tooltipProps, ...restProps }, ref) => {
        const [text, setText] = useState(title);

        const handleClick = () => {
            if (doneTitle) setText(doneTitle);
            onClick();
        };

        return (
            <Tooltip
                position='top'
                view='hint'
                trigger='hover'
                onOpenDelay={doneTitle ? 300 : 600}
                {...tooltipProps}
                content={text}
                onOpen={() => setText(title)}
            >
                <Button
                    type='button'
                    size='s'
                    view='secondary'
                    onClick={handleClick}
                    className={active && 'active'}
                    icon={icon}
                    ref={ref}
                    {...restProps}
                />
            </Tooltip>
        );
    },
);
