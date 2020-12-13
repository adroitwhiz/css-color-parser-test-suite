const tests = test => {
    test('#ff0000', {model: 'rgb', value: [255, 0, 0, 1]}, '6-digit hex');
    test('#f00', {model: 'rgb', value: [255, 0, 0, 1]}, '3-digit hex');

    test('#f00c', {model: 'rgb', value: [255, 0, 0, 0.8]}, '4-digit hex with alpha', {isLevel4: true});
    test('#ff0000cc', {model: 'rgb', value: [255, 0, 0, 0.8]}, '8-digit hex with alpha', {isLevel4: true});

    test('#FF0000', {model: 'rgb', value: [255, 0, 0, 1]}, 'uppercase hex');
    test('#Ff0000', {model: 'rgb', value: [255, 0, 0, 1]}, 'mixed-case hex');

    test('#ff000', null, '5-digit hex');
    test('#ffz000', null, 'hex with invalid character replaced');
    test('#fffz000', null, 'hex with invalid character inserted');
};

module.exports = tests;
