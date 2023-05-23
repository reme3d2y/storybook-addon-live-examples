import remarkMdxCodeMeta from 'remark-mdx-code-meta';

export function patchWebpackConfig(config: any) {
    const mdxExt = '.mdx';
    const mdx2Loader = '@storybook/mdx2-csf';
    const mdxRules = config.module.rules.filter((rule: any) =>
        rule.test?.toString().includes(mdxExt),
    );

    mdxRules.forEach((rule: any) => {
        if (rule.use?.[0]?.loader.includes(mdx2Loader)) {
            rule.use[0].options.mdxCompileOptions.remarkPlugins.push(remarkMdxCodeMeta);
        }
    });

    return config;
}
