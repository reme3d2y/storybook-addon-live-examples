import { css, styled } from '@storybook/theming';
import React, { FC, ReactNode } from 'react';

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

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fafafa;
    border-bottom: 1px solid #dbdee1;
`;

const RightAddons = styled.div`
    position: relative;

    &::before {
        content: '';
        display: block;
        transform: translateY(-50%);
        top: 50%;
        left: 0;
        height: 24px;
        width: 1px;
        background: #e7e9eb;
        position: absolute;
    }
`;

export const ActionBarComponent: FC<WrapperProps> = ({ rightAddons, children }) => (
    <Wrapper>
        {children}

        {rightAddons && <RightAddons>{rightAddons}</RightAddons>}
    </Wrapper>
);

export const ActionBar = Object.assign(ActionBarComponent, {
    Item,
});
