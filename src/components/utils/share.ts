import { getConfig } from '../../config';

export async function share(code: string) {
    const config = getConfig();

    const { sandboxPath, shareMode, githubToken } = config;

    if (shareMode === 'url') {
        return `${window.parent.location.origin}?path=${sandboxPath}/code=${encodeURIComponent(
            code,
        )}`;
    }

    if (shareMode === 'gist') {
        const id = await createGist(code, githubToken);
        return `${window.parent.location.origin}?path=${sandboxPath}/code=gist:${id}`;
    }
}

const FILENAME = 'example.js';

export async function createGist(code: string, token: string) {
    const apiUrl = 'https://api.github.com/gists';

    const data = {
        description: 'Example from Storybook',
        public: false,
        files: {
            [FILENAME]: {
                content: code,
            },
        },
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to create gist: ${response.statusText}`);
    }

    const result = await response.json();

    return result.id;
}

export async function loadGist(id: string) {
    const apiUrl = `https://api.github.com/gists/${id}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Failed to load gist: ${response.statusText}`);
    }

    const result = await response.json();
    if ('message' in result) {
        throw new Error(`${result.status}: ${result.message}`);
    }

    return result.files[FILENAME].content;
}
