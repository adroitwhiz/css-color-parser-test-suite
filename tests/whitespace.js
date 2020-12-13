const tests = test => {
    test('   #ff0000', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with leading spaces');
    test('#ff0000    ', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with trailing spaces');
    test('   #ff0000    ', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with leading and trailing spaces');

    test('\n#ff0000\n', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with leading and trailing newlines');
    test('\r\n#ff0000\n\r', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with leading and trailing newlines + carriage returns');
    test('\t#ff0000\t', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with leading and trailing tabs');
    test('\n  \r\t  \t\n   #ff0000\n  \t  \r\n  \t   ', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex with leading and trailing mixed whitespace');
};

module.exports = tests;
