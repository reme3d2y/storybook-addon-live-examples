import { DocsContext, SourceContext, getSourceProps } from '@storybook/addon-docs';
import {
    isValidElement,
    MutableRefObject,
    ReactNode,
    useContext,
    useLayoutEffect,
    useState,
} from 'react';

export function useCodeFromProps(
    codeProp: ReactNode,
    wrapperRef: MutableRefObject<HTMLDivElement>,
) {
    const docsContext = useContext(DocsContext);
    const sourceContext = useContext(SourceContext);

    const [code, setCode] = useState('');

    useLayoutEffect(() => {
        if (typeof codeProp === 'string') {
            setCode(codeProp.trim());
            return;
        }

        if (isValidElement(codeProp) && codeProp.props.id) {
            const sourceProps = getSourceProps(codeProp.props, docsContext, sourceContext);

            if (sourceProps.code) {
                setCode(`render(${sourceProps.code.trim()})`);
                return;
            }
        }
    }, [wrapperRef.current]);

    return code;
}
