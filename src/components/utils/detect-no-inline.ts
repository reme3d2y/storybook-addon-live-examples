export function detectNoInline(code: string) {
    const clearedCode = code
        .split('\n')
        .filter((line) => line.startsWith('//') === false)
        .join('\n')
        .trim();

    return clearedCode.startsWith('<') === false && clearedCode.startsWith('//') === false;
}
