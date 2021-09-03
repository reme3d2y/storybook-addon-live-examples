import { Language } from 'prism-react-renderer';

export const extractLanguageFromFilename = (filename = ''): Language => {
    return filename.split('.').slice(-1)[0] as Language;
};
