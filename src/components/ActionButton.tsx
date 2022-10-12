import { styled } from '@storybook/theming';
import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { configValue } from '../config';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode;
    onClick?: () => void;
    active?: boolean;
};

const Button = styled.button<Props>(
    ({ theme }) => `
    width: 48px;
    height: 48px;
    opacity: 0.3;
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    margin: 0;
    text-align: center;
    text-decoration: none;
    background-color: transparent;
    border: 0;
    outline: none;
    box-shadow: none;
    user-select: none;
    cursor: pointer;
    transition: background 0.2s ease, border 0.2s ease, color 0.2s ease, transform 0.12s ease;
    box-sizing: border-box;
    color: ${configValue('borderColor', '#000')};

    &.active {
        opacity: 1;
    }

    &:hover:not(.active):not(:disabled) {
        opacity: 0.5;
    }

    &:active:not(:disabled):not(.active) {
        opacity: 0.8;
    }

    &:disabled {
        cursor: default;
        opacity: 0.3;
    }
`,
);

export const ActionButton: FC<Props> = ({ icon, onClick, active, ...restProps }) => (
    <Button
        type='button'
        onClick={onClick}
        active={active}
        className={active ? 'active' : ''}
        {...restProps}
    >
        {icon}
    </Button>
);
