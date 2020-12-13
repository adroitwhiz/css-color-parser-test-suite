const {table} = require('table');
const c = require('ansi-colors');

const colorString = require('color-string');
const parseColor = require('parse-color');
const colorParse = require('color-parse');
const paper = require('paper-jsdom');
const tinycolor = require('tinycolor2');
const {createCanvas} = require('canvas');
const {CSSStyleDeclaration} = require('cssstyle');
const Collit = require('collit');
const {parseToHsl, parseToRgb} = require('polished');
const myParser = require('css-color-parser');

const makeTestFunc = require('./make-test-func');

const testedFunctions = [
    {
        name: 'color-string',
        func: str => {
            const keywordVal = colorString.get.rgb(str);
            if (keywordVal) return {
                model: 'rgb', value: keywordVal
            };
            return colorString.get(str);
        },
        testType: 'match'
    },
    {
        name: 'parse-color',
        func: str => {
            const result = parseColor(str);
            if (!result.rgb) return null;
            if (str.trim().startsWith('hsl')) {
                return {
                    model: 'hsl',
                    value: result.hsla
                };
            } else if (str.trim().startsWith('rgb')) {
                return {
                    model: 'rgb',
                    value: result.rgba
                };
            } else {
                return {
                    model: 'rgb',
                    value: result.rgba
                };
            }
        },
        testType: 'match'
    },
    {
        name: 'color-parse',
        func: str => {
            const result = colorParse(str);

            if (result === null) return null;

            return {
                model: result.space,
                value: [...result.values, result.alpha]
            };
        },
        testType: 'match'
    },

    {
        name: 'tinycolor',
        func: str => {
            const result = tinycolor(str);

            let colorFormat = result.getFormat();
            if (colorFormat === 'name' || colorFormat === 'hex') colorFormat = 'rgb';

            let value;

            if (colorFormat === 'rgb') {
                const out = result.toRgb();
                value = [out.r, out.g, out.b, out.a];
            } else if (colorFormat === 'hsl') {
                const out = result.toHsl();
                value = [out.h, out.s * 100, out.l * 100, out.a];
            } else {
                return null;
            }

            return {
                model: colorFormat,
                value
            };
        },
        testType: 'match'
    },
    {
        name: 'collit',
        func: str => {
            let resultType;
            if (Collit.Validator.isRgb(str) || Collit.Validator.isRgba(str) || Collit.Validator.isColorName(str) || Collit.Validator.isHex(str)) {
                resultType = 'rgb';
            } else if (Collit.Validator.isHsl(str) || Collit.Validator.isHsla(str)) {
                resultType = 'hsl';
            } else {
                return null;
            }

            let result = Collit.Parser.parseColor(str);

            return {
                model: resultType,
                value: resultType === 'rgb' ? [
                    result.rgb.r,
                    result.rgb.g,
                    result.rgb.b,
                    'a' in result.rgb ? result.rgb.a : 1
                ] : [
                    result.hsl.h,
                    result.hsl.s * 100,
                    result.hsl.l * 100,
                    'a' in result.hsl ? result.hsl.a : 1
                ]
            };
        },
        testType: 'match'
    },
    {
        name: 'paper.js',
        func: str => {
            const result = new paper.Color(str);

            return {
                model: result.type,
                value: result.type === 'rgb' ?
                    [result.red * 255, result.green * 255, result.blue * 255, result.alpha] :
                    [result.hue, result.saturation * 100, result.lightness * 100, result.alpha]
            };
        },
        testType: 'match'
    },
    {
        name: 'node-canvas',
        func: (function () {
            const canvas = createCanvas(1, 1);
            const ctx = canvas.getContext('2d');

            return str => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                ctx.fillStyle = str;
                return !ctx.fillStyle.startsWith('rgba(0, 0, 0, 0');
            };
        })(),
        testType: 'pass-fail'
    },
    {
        name: 'jsdom',
        func: str => {
            const s = new CSSStyleDeclaration();
            s.color = str;

            return s.color !== '';
        },
        testType: 'pass-fail'
    },
    {
        name: 'polished',
        func: str => {
            try {
                if (str.trim().startsWith('hsl')) {
                    let result = parseToHsl(str);
                    return {
                        model: 'hsl',
                        value: [result.hue, result.saturation * 100, result.lightness * 100, 'alpha' in result ? result.alpha : 1]
                    };
                } else {
                    let result = parseToRgb(str);
                    return {
                        model: 'rgb',
                        value: [result.red, result.green, result.blue, 'alpha' in result ? result.alpha : 1]
                    };
                }
            } catch (e) {
                return null;
            }
        },
        testType: 'match'
    },
    {
        name: 'my parser',
        func: str => {
            return myParser((model, ...value) => {
                if (model === null) return null;
                return {
                    model,
                    value
                };
            }, str);
        },
        testType: 'match'
    }
];

const failures = [];
const allTests = [];
const test = makeTestFunc(testedFunctions, failures, allTests, {runLevel4Tests: true});

const keywords = require('./tests/keywords');
const hex = require('./tests/hex');
const whitespace = require('./tests/whitespace');
const rgb = require('./tests/rgb');
const hsl = require('./tests/hsl');
const hwb = require('./tests/hwb');
const lab = require('./tests/lab');
const lch = require('./tests/lch');
const deviceCmyk = require('./tests/device-cmyk');

keywords(test);
hex(test);
whitespace(test);
rgb(test);
hsl(test);
hwb(test);
lab(test);
lch(test);
deviceCmyk(test);

// console.log(JSON.stringify(failures, null, 4));

const rows = [
    ['Test', 'Input', 'L4', ...testedFunctions.map(f => f.name)]
];

allTests.sort((a, b) => a.isLevel4 && !b.isLevel4 ? 1 : b.isLevel4 && !a.isLevel4 ? -1 : 0);

for (const test of allTests) {
    const fails = failures.filter(failure => failure.test === test);

    const row = [test.msg, JSON.stringify(test.input), test.isLevel4 ? '✓' : ''];

    for (const f of testedFunctions) {
        row.push(fails.some(fail => fail.func === f.name) ? '❌' : '✅');
    }

    rows.push(row);
}

console.log(table(rows, {
    border: {
        topBody: '',
        topJoin: '',
        topLeft: '',
        topRight: '',
        bottomBody: '',
        bottomJoin: '',
        bottomLeft: '',
        bottomRight: '',
        bodyLeft: '|',
        bodyRight: '|',
        bodyJoin: '|',
        joinBody: '-',
        joinLeft: '|',
        joinRight: '|',
        joinJoin: '|'
    },
    drawHorizontalLine: (index) => index === 1
}));
