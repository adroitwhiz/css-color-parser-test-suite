const tests = test => {
    test('red', {model: 'rgb', value: [255, 0, 0, 1]}, 'red color keyword');
    test('rebeccapurple', {model: 'rgb', value: [102, 51, 153, 1]}, 'rebeccapurple color keyword', {isLevel4: true});
    test('transparent', {model: 'rgb', value: [0, 0, 0, 0]}, 'transparent color keyword');

    test('RED', {model: 'rgb', value: [255, 0, 0, 1]}, 'uppercase color keyword');
    test('TRANSPARENT', {model: 'rgb', value: [0, 0, 0, 0]}, 'uppercase transparent color keyword');
};

module.exports = tests;
