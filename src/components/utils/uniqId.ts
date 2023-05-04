export const uniqId = (() => {
    let id = 0;

    return () => {
        id += 1;
        return id;
    };
})();
