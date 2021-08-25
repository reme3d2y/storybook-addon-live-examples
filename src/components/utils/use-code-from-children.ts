import { DocsContext, SourceContext, getSourceProps } from '@storybook/addon-docs';
import {
    isValidElement,
    MutableRefObject,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

export function useCodeFromChildren(
    children: ReactNode,
    wrapperRef: MutableRefObject<HTMLDivElement>,
) {
    const docsContext = useContext(DocsContext);
    const sourceContext = useContext(SourceContext);

    const [code, setCode] = useState('');

    useEffect(() => {
        if (typeof children === 'string') {
            setCode(children.trim());
            return;
        }

        if (isValidElement(children) && children.props.id) {
            const sourceProps = getSourceProps(children.props, docsContext, sourceContext);

            if (sourceProps.code) {
                setCode(`render(${sourceProps.code.trim()})`);
                return;
            }
        }
    }, [wrapperRef.current]);

    return code;
}
