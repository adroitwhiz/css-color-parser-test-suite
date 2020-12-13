const tests = test => {
    const variants = [
        ['with alpha', 'no alpha'],
        ['', 'deg', 'grad', 'rad', 'turn']
    ];

    const numPermutations = variants.reduce((prev, cur) => prev * cur.length, 1);

    for (let i = 0; i < numPermutations; i++) {
        const variantValues = [];
        let variantRange = 1;
        for (let j = 0; j < variants.length; j++) {
            let variantValue = (Math.floor(i / variantRange)) % variants[j].length;
            if (variants[j].length === 2) variantValue = variantValue === 1;
            variantValues.push(variantValue);
            variantRange *= variants[j].length;
        }

        const hasAlpha = variantValues[0];

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
            channelValues = channelValues.join(' ');

            const testString = `hwb(${channelValues}${hasAlpha ? ' / ' + (alphaIsPercentage ? '30%' : '0.3') : ''})`;

            test(testString, {model: 'hwb', value: [50, 80, 35, hasAlpha ? 0.3 : 1]}, 'hwb(), ' + chosen.join(', '), {isLevel4: true});
        };

        if (hasAlpha) {
            runTest(true);
        }
        runTest(false);
    }
};

module.exports = tests;
