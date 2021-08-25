import React from 'react';
import PropTypes from 'prop-types';

/**
 * Информирует пользователя о текущем состоянии операций (заказ карты, кредит... ) или сообщает пользователю о результате выполнения его команды.
 *
 * [Макет](https://www.figma.com/file/KlFOLLkKO8rtvvQE3RXuhq/Click-Library?node-id=29455%3A167135)
 */
export const Docs = ({ children }) => {
    return <div>{children}</div>;
};

Docs.propTypes = {
    /**
     * Is this the principal call to action on the page?
     */
    children: PropTypes.node,
};

export default Docs;
