const tests = test => {
    test('device-cmyk(70% 30% 25% 20%)', {model: 'device-cmyk', value: [70, 30, 25, 20, 1, null]}, 'device-cmyk() with percentages', {isLevel4: true});
    test('device-cmyk(70% 0.3 25% 0.2000)', {model: 'device-cmyk', value: [70, 30, 25, 20, 1, null]}, 'device-cmyk() with mixed percentages and decimals', {isLevel4: true});
    test('device-cmyk(70% 30% 25% 20% / 0.3)', {model: 'device-cmyk', value: [70, 30, 25, 20, 0.3, null]}, 'device-cmyk() with alpha', {isLevel4: true});
    test('device-cmyk(700% -30% 25% 20%)', {model: 'device-cmyk', value: [100, 0, 25, 20, 1, null]}, 'device-cmyk() with out-of-range values', {isLevel4: true});
    test('device-cmyk(70% 30% 25% 20% / 0.3, rgba(1, 0, 0, 0))', {model: 'device-cmyk', value: [70, 30, 25, 20, 0.3, 'rgba(1, 0, 0, 0)']}, 'device-cmyk() with fallback', {isLevel4: true});
};

module.exports = tests;
