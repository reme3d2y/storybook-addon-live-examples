import React, { FC } from 'react';

type CSFProps = {
    /**
     * Some component prop
     */
    value: string;
};

/**
 * ----
 *
 * #### [See source code](https://raw.githubusercontent.com/reme3d2y/storybook-addon-live-examples/main/stories/CSF.stories.tsx)
 */
export const CSF: FC<CSFProps> = ({ value }) => {
    return <>{value}</>;
};
