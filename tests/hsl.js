const tests = test => {
    const variants = [
        ['hsl()', 'hsla()'],
        ['no alpha', 'with alpha'],
        ['no commas', 'commas'],
        ['', 'deg', 'grad', 'rad', 'turn']
    ];

    const numPermutations = variants.reduce((prev, cur) => prev * cur.length, 1);

    for (let i = 0; i < numPermutations; i++) {
        const variantValues = [];
        let variantRange = 1;
        for (let j = 0; j < variants.length; j++) {
            let variantValue = (Math.floor(i / variantRange)) % variants[j].length;
            if (variants[j].length === 2) variantValue = variantValue === 0;
            variantValues.push(variantValue);
            variantRange *= variants[j].length;
        }

        const [
            functionNameEndsInA,
            hasAlpha,
            hasCommas,
        ] = variantValues;

        const runTest = alphaIsPercentage => {

            const chosen = variants.map((options, index) => options[Number(variantValues[index])]);
            const hueUnits = chosen[chosen.length - 1];
            chosen[chosen.length - 1] = hueUnits === '' ? 'no hue unit' : `hue unit is ${hueUnits}`;
            if (hasAlpha) {
                chosen.push(alphaIsPercentage ? 'alpha is a percentage' : 'alpha is a float');
            }

            const hueUnitValues = {
                '': '50',
                'deg': '50deg',
                'grad': '55.5grad',
                'rad': '0.87266rad',
                'turn': '0.139turn'
            };

            let channelValues = [hueUnitValues[hueUnits], '80%', '35%'];
            channelValues = channelValues.join(hasCommas ? ', ': ' ');

            const testString = `hsl${functionNameEndsInA ? 'a' : ''}(${channelValues}${hasAlpha ? (hasCommas ? ', ' : ' / ') + (alphaIsPercentage ? '30%' : '0.3') : ''})`;

            const isLevel4 = (!hasCommas) || (hasAlpha !== functionNameEndsInA) || hueUnits !== '' || (hasAlpha && alphaIsPercentage);

            test(testString, {model: 'hsl', value: [50, 80, 35, hasAlpha ? 0.3 : 1]}, chosen.join(', '), {isLevel4});
        };

        if (hasAlpha) {
            runTest(true);
        }
        runTest(false);
    }

    test('hsl(50%, 80%, 35%)', null, 'hsl() with hue as a percentage');
    test('hsl(50, 0.8, 0.35)', null, 'hsl() with saturation and lightness as floats');
    test('hsl(750, 80%, 35%)', {model: 'hsl', value: [30, 80, 35, 1]}, 'hsl() with a hue > 360');
    test('hsl(-500, 80%, 35%)', {model: 'hsl', value: [220, 80, 35, 1]}, 'hsl() with a hue < -360');
    test('hsl(30.51, 80%, 35%)', {model: 'hsl', value: [30.51, 80, 35, 1]}, 'hsl() with fractional hue');
    test('hsl(3051e-2, 80%, 35%)', {model: 'hsl', value: [30.51, 80, 35, 1]}, 'hsl() with scientific notation hue');
};

module.exports = tests;
