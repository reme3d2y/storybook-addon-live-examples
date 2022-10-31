import { IconButton, IconButtonProps } from '@alfalab/core-components/icon-button';
import { styled } from '@storybook/theming';
import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { configValue } from '../config';

type Props = IconButtonProps & {
    onClick?: () => void;
    active?: boolean;
};

const Button = styled(IconButton)<Props>(
    ({ theme }) => `
    &.active {
        color: ${configValue('iconColor', '#000')};
    }
`,
);

export const ActionButton: FC<Props> = ({ icon, onClick, active, ...restProps }) => (
    <Button
        type='button'
        size='s'
        view='secondary'
        onClick={onClick}
        className={active && 'active'}
        icon={icon}
        {...restProps}
    />
);
