import { ValidateUrlFormatPromise } from './validationRules'

const urlTestCases = [
    { i: "https://www.google.com", r: true },
    { i: "ijfeprsigperoijgperjgpa", r: false },
    { i: "https://www.bing.com", r: true },
    { i: "https://www.yahoo.com", r: true }
]

urlTestCases.forEach(testCase => {
    test('tests if a ' + testCase.i + ' is well formed', () => {
        return ValidateUrlFormatPromise(testCase.i).then(data => {
            expect(data.passed).toEqual(testCase.r);
        })
    })
});

