declare module 'global';

declare module '*.mdx';

declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
}
