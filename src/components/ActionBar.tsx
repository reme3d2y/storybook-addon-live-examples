import { styled } from '@storybook/theming';
import React, { FC, ReactNode } from 'react';
import { configValue } from '../config';

type ItemProps = {
    right?: boolean;
    children?: ReactNode;
};

const ItemWrapper = styled.div<ItemProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${(props) => props.right && `margin-left: auto;`}
`;

export const Item: FC<ItemProps> = ({ children, right }) => (
    <ItemWrapper right={right}>{children}</ItemWrapper>
);

type WrapperProps = {
    rightAddons?: ReactNode;
    children?: ReactNode;
};

const Wrapper = styled.div(
    ({ theme }) => `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: ${configValue('previewBgColor', theme.background.app)};
        border-bottom: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    `,
);

const RightAddons = styled.div(
    ({ theme }) => `
        position: relative;

        &::before {
            content: '';
            display: block;
            transform: translateY(-50%);
            top: 50%;
            left: 0;
            height: 24px;
            width: 1px;
            background: ${configValue('borderColor', theme.appBorderColor)};
            position: absolute;
        }
    `,
);

export const ActionBarComponent: FC<WrapperProps> = ({ rightAddons, children }) => (
    <Wrapper>
        {children}

        {rightAddons && <RightAddons>{rightAddons}</RightAddons>}
    </Wrapper>
);

export const ActionBar = Object.assign(ActionBarComponent, {
    Item,
});
