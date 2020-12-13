const tests = test => {
    test('lab(50% 35 -20)', {model: 'lab', value: [50, 35, -20, 1]}, 'lab() with no alpha', {isLevel4: true});
    test('lab(50% 35 -20 / 0.5)', {model: 'lab', value: [50, 35, -20, 0.5]}, 'lab() with alpha', {isLevel4: true});
    test('lab(250% 35 -20)', {model: 'lab', value: [250, 35, -20, 1]}, 'lab() with lightness above 100', {isLevel4: true});
    test('lab(-50% 35 -20)', {model: 'lab', value: [0, 35, -20, 1]}, 'lab() with lightness below 0', {isLevel4: true});
    test('lab(50% 335 -2750)', {model: 'lab', value: [50, 335, -2750, 1]}, 'lab() with large a and b', {isLevel4: true});
    test('lab(50 35 -20)', null, 'lab() with non-percentage lightness', {isLevel4: true});
    test('lab(50% 33% -20%)', null, 'lab() with percentage a and b', {isLevel4: true});
};

module.exports = tests;
