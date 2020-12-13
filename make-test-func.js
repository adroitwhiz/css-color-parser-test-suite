const colorResultsEqual = (c1, c2) => {
    if (c1 === null || c2 === null) {
        return c1 === c2;
    }

    if (c1.model !== c2.model) return false;

    if (c1.model === 'device-cmyk') {
        return (
            Math.abs(c1.value[0] - c2.value[0]) <= 2 &&
            Math.abs(c1.value[1] - c2.value[1]) <= 2 &&
            Math.abs(c1.value[2] - c2.value[2]) <= 2 &&
            Math.abs(c1.value[3] - c2.value[3]) <= 2 &&
            Math.abs(c1.value[4] - c2.value[4]) <= 0.01 &&
            c1.value[5] === c2.value[5]
        );
    }

    return (
        Math.abs(c1.value[0] - c2.value[0]) <= 2 &&
        Math.abs(c1.value[1] - c2.value[1]) <= 2 &&
        Math.abs(c1.value[2] - c2.value[2]) <= 2 &&
        Math.abs(c1.value[3] - c2.value[3]) <= 0.01
    );
};

const makeTestFunc = (wrappedFuncs, failures, allTests, runOpts = {}) => {
    const test = (input, expected, msg, opts) => {
        const testObj = {
            expected,
            msg,
            input,
            isLevel4: opts && Object.prototype.hasOwnProperty.call(opts, 'isLevel4') && opts.isLevel4
        };

        if (testObj.isLevel4 && !runOpts.runLevel4Tests) return;

        for (const func of wrappedFuncs) {
            const result = func.func(input);
            switch (func.testType) {
                case 'match':
                    if (!colorResultsEqual(result, expected)) {
                        failures.push({func: func.name, result, test: testObj});
                    }
                    break;
                case 'pass-fail': {
                    if (result !== (expected !== null)) {
                        failures.push({func: func.name, result, test: testObj});
                    }
                }
            }
        }

        allTests.push(testObj);
    };

    return test;
};

module.exports = makeTestFunc;
