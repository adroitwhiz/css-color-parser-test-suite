const tests = test => {
    test('lch(50% 35 20)', {model: 'lch', value: [50, 35, 20, 1]}, 'lch() with no hue unit', {isLevel4: true});
    test('lch(50% 35 20deg)', {model: 'lch', value: [50, 35, 20, 1]}, 'lch() with deg', {isLevel4: true});
    test('lch(50% 35 22.22grad)', {model: 'lch', value: [50, 35, 20, 1]}, 'lch() with grad', {isLevel4: true});
    test('lch(50% 35 0.349rad)', {model: 'lch', value: [50, 35, 20, 1]}, 'lch() with rad', {isLevel4: true});
    test('lch(50% 35 0.0556turn)', {model: 'lch', value: [50, 35, 20, 1]}, 'lch() with turn', {isLevel4: true});
    test('lch(50% 35 20 / 0.5)', {model: 'lch', value: [50, 35, 20, 0.5]}, 'lch() with alpha', {isLevel4: true});

    test('lch(250% 35 20)', {model: 'lch', value: [250, 35, 20, 1]}, 'lch() with lightness above 100', {isLevel4: true});
    test('lch(-50% 35 20)', {model: 'lch', value: [0, 35, 20, 1]}, 'lch() with lightness below 0', {isLevel4: true});

    test('lch(50% 350 20)', {model: 'lch', value: [50, 350, 20, 1]}, 'lch() with large chroma', {isLevel4: true});
    test('lch(50% -50 20)', {model: 'lch', value: [50, 0, 20, 1]}, 'lch() with chroma below 0', {isLevel4: true});
};

module.exports = tests;
