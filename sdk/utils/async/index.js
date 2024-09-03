const eachLimit = async (arr, limit, asyncFn) => {
    const promises = [];

    for (let i = 0; i < arr.length; i++) {
        const p = asyncFn(arr[i], i, arr);
        promises.push(p);

        if (promises.length >= limit) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }
};

module.exports = { eachLimit };
