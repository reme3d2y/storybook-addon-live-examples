function previewAnnotations(entry = []) {
    return [...entry, require.resolve('./dist/esm/preset/preview')];
}

module.exports = {
    previewAnnotations,
};
