import { describe, expect, it } from 'vitest';
import {
    getFileNameWithoutExtension,
    getStringOrUndefinedAsPropertyValue,
    isNotUndefined,
    singleItemToArray,
    sortAlphabetically,
    toOutputDirPath,
    toSafePropertyValue,
    uniqueFilter
} from '../../lib/core/core.utils.js';

describe('Core - uniqueFilter', () => {
    it('Array should contain only unique values', () => {
        expect(['a', 'b', 'c', 'c', 'c', 'b', 'a'].filter(uniqueFilter)).toStrictEqual(['a', 'b', 'c']);
    });
});

describe('Core - sortAlphabetically', () => {
    it('Array should be sorted alphabetically', () => {
        expect(sortAlphabetically(['d', 'a', 'c', 'b', 'e'], (m) => m)).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
    });
});

describe('Core - singleItemToArray', () => {
    it('Should wrap item in an array', () => {
        expect(singleItemToArray('a')).toStrictEqual(['a']);
        expect(singleItemToArray(1)).toStrictEqual([1]);
    });
});

describe('Core - isNotUndefined', () => {
    it('Array should contain only defined values', () => {
        expect([undefined, 'a', 'b', 'c', undefined, undefined].filter(isNotUndefined)).toStrictEqual(['a', 'b', 'c']);
    });
});

describe('Core - toSafePropertyValue', () => {
    it('Should escape all apostrophes', () => {
        expect(toSafePropertyValue(`'''va'''lue''''`)).toStrictEqual('value');
    });
});

describe('Core - toOutputDirPath', () => {
    it(`Should default to './' when path is not defined`, () => {
        expect(toOutputDirPath(undefined)).toStrictEqual('./');
    });

    it(`Should default to './' when path is not defined`, () => {
        expect(toOutputDirPath(`..//path//to//dir`)).toStrictEqual('../path/to/dir/');
    });
});

describe('Core - getStringOrUndefinedAsPropertyValue', () => {
    it('Gets string within apostrophes when its defined', () => {
        expect(getStringOrUndefinedAsPropertyValue('value')).toStrictEqual(`'value'`);
    });

    it(`Gets 'undefined' value when string is not defined`, () => {
        expect(getStringOrUndefinedAsPropertyValue(undefined)).toStrictEqual('undefined');
    });
});

describe('Core - getFileNameWithoutExtension', () => {
    it('Gets filename without the extension', () => {
        expect(getFileNameWithoutExtension('file.ts')).toStrictEqual('file');
        expect(getFileNameWithoutExtension('file.js')).toStrictEqual('file');
        expect(getFileNameWithoutExtension('file')).toStrictEqual('file');
    });
});
