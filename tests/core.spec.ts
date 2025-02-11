import { describe, expect, it } from 'vitest';
import { isNotUndefined, uniqueFilter } from '../lib/core/core.utils.js';

describe('Core - uniqueFilter', () => {
    it('Array should contain only unique values', () => {
        expect(['a', 'b', 'c', 'c', 'c', 'b', 'a'].filter(uniqueFilter)).toStrictEqual(['a', 'b', 'c']);
    });
});

describe('Core - isNotUndefined', () => {
    it('Array should contain only defined values', () => {
        expect(['a', 'b', 'c', undefined, undefined].filter(isNotUndefined)).toStrictEqual(['a', 'b', 'c']);
    });
});
