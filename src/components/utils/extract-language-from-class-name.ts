import { Language } from 'prism-react-renderer';

export const extractLanguageFromClassName = (classNameString = ''): Language =>
    classNameString.split(/\s+/).reduce((acc: any, className) => {
        if (className.startsWith('language-')) {
            acc = className.replace('language-', '');
        }
        return acc;
    }, 'tsx');
