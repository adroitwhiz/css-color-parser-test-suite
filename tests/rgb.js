const tests = test => {
    const variants = [
        ['rgba()', 'rgb()'],
        ['with alpha', 'no alpha'],
        ['commas', 'no commas'],
        ['percentages', '0-255']
    ];

    const numPermutations = 2 ** variants.length;
    for (let i = 0; i < numPermutations; i++) {
        const variantValues = [];
        for (let j = 0; j < variants.length; j++) {
            const variantValue = ((i >> j) & 1) === 1;
            variantValues.push(variantValue);
        }

        const [
            functionNameEndsInA,
            hasAlpha,
            hasCommas,
            usesPercentages
        ] = variantValues;

        const runTest = alphaIsPercentage => {
            let channelValues = usesPercentages ? ['50%', '60%', '25%'] : ['127', '153', '64'];
            channelValues = channelValues.join(hasCommas ? ', ': ' ');

            const chosen = variants.map((options, index) => variantValues[index] ? options[0] : options[1]);
            if (hasAlpha) {
                chosen.push(alphaIsPercentage ? 'alpha is a percentage' : 'alpha is a float');
            }

            const testString = `rgb${functionNameEndsInA ? 'a' : ''}(${channelValues}${hasAlpha ? (hasCommas ? ', ' : ' / ') + (alphaIsPercentage ? '30%' : '0.3') : ''})`;

            const isLevel4 = (!hasCommas) || (hasAlpha !== functionNameEndsInA) || (hasAlpha && alphaIsPercentage);

            test(testString, {model: 'rgb', value: [127, 153, 64, hasAlpha ? 0.3 : 1]}, chosen.join(', '), {isLevel4});
        };

        if (hasAlpha) {
            runTest(true);
        }
        runTest(false);
    }

    test('rgb(30.7, 60.6, 41.2)', {model: 'rgb', value: [31, 61, 41, 1]}, 'rgb() with decimals', {isLevel4: true});
    test('rgb(.4, .4, .4)', {model: 'rgb', value: [0, 0, 0, 1]}, 'rgb() with decimals without leading digits', {isLevel4: true});
    test('rgb(5.5%, 10.875%, 32.25%)', {model: 'rgb', value: [14, 28, 82, 1]}, 'rgb() with decimal percentages');
    test('rgb(5..5%, 10....875%, 32...25%)', null, 'rgb() percentages with multiple decimal points');
    test('rgb(-5%, 10.875%, -32.25%)', {model: 'rgb', value: [0, 28, 0, 1]}, 'rgb() with negative percentages');
    test('rgb(+5%, 10.875%, +32.25%)', {model: 'rgb', value: [14, 28, 82, 1]}, 'rgb() with unary-positive percentages');
    test('rgb(300, 170, 750)', {model: 'rgb', value: [255, 170, 255, 1]}, 'rgb() with above-maximum numbers');
    test('rgb(-132, 170, -72)', {model: 'rgb', value: [0, 170, 0, 1]}, 'rgb() with negative numbers');
    test('rgb(+132, +170, +73)', {model: 'rgb', value: [132, 170, 73, 1]}, 'rgb() with unary-positive numbers');
    test('rgb(+132+170+73)', {model: 'rgb', value: [132, 170, 73, 1]}, 'rgb() with unary-positive numbers and no spaces', {isLevel4: true});
    test('rgb(.4.4.4)', {model: 'rgb', value: [0, 0, 0, 1]}, 'no-comma rgb() without any spaces', {isLevel4: true});
    test('rgb(30e+0, 57000e-3, 4.0e+1)', {model: 'rgb', value: [30, 57, 40, 1]}, 'rgb() with scientific notation', {isLevel4: true});
    test('rgb(30e+0%, 57000e-3%, 4e+1%)', {model: 'rgb', value: [77, 145, 102, 1]}, 'rgb() with scientific notation percentages');
    test('rgb(128, 192, 64', {model: 'rgb', value: [128, 192, 64, 1]}, 'rgb() with missing close-paren');
    test('rgb(   132,    170, 73    )', {model: 'rgb', value: [132, 170, 73, 1]}, 'rgb() with extra spaces inside parentheses');
    test('rgb(132,170,73)', {model: 'rgb', value: [132, 170, 73, 1]}, 'rgb() with commas but no spaces');
    test('rgb(\n132,\n170,\n73\n)', {model: 'rgb', value: [132, 170, 73, 1]}, 'rgb() with newlines');
    test('rgb(\t132,\t170,\t73\t)', {model: 'rgb', value: [132, 170, 73, 1]}, 'rgb() with tabs');
    test('rgba(132, 170, 73, 1, 0.5)', null, 'rgba() with too many components');
    test('rgba(132, 170)', null, 'rgba() with not enough components');
    test('rgb(132, 170, 73, 1, 0.5)', null, 'rgb() with too many components');
    test('rgb(132, 170)', null, 'rgb() with not enough components');
    test('rgb 132, 170, 73', null, 'rgb with no parentheses');
    test('rgb132,170,73', null, 'rgb with no parentheses or spaces');
    test('rgb (132, 170, 73)', null, 'rgb () with space before opening parenthesis');
    test('rgb(132, 170, 73)garbage', null, 'rgb() with extra garbage after');
    test('rgb(5%, 50, 30%)', null, 'rgb() with mixed percentages/numbers');
    test('rgb(3e, 50, 30)', null, 'rgb() with an "e" where it should not be');
    test('rgb(3blah, 50, 30)', null, 'rgb() with extra letters after values');
    test('rgb(50 50, 30)', null, 'rgb() with mixed commas/no commas', {isLevel4: true});
    test('RGB(132, 170, 73)', {model: 'rgb', value: [132, 170, 73, 1]}, 'RGB() in uppercase');
    test('RgB(132, 170, 73)', {model: 'rgb', value: [132, 170, 73, 1]}, 'RgB() in mixed case');
    test('rgba(132, 170, 73, 5e-1)', {model: 'rgb', value: [132, 170, 73, 0.5]}, 'rgba() with scientific notation alpha');
    test('rgb(132 170 73 0.5)', null, 'rgb() with no commas and no slash before alpha', {isLevel4: true});
};

module.exports = tests;
