import { describe, expect, it } from 'vitest';
import { mapFilename, mapName, resolveCase, resolvePropertyName } from '../../lib/core/resolvers.js';

describe('Resolvers - mapName', () => {
    it('Custom name should be used when function is used as arg (camelCase)', () => {
        expect(mapName((item) => `${item.name}custom`, 'camelCase')({ name: 'x' })).toStrictEqual('xcustom');
    });

    it('Custom name should be used when function is used as arg (pascalCase)', () => {
        expect(mapName((item) => `${item.name}Custom`, 'pascalCase')({ name: 'X' })).toStrictEqual('XCustom');
    });

    it('Prefix should be applied to name', () => {
        expect(mapName(() => `custom`, 'camelCase', { prefix: 'x_' })({ name: '' })).toStrictEqual('x_custom');
    });

    it('Default case should be used when resolver is undefined (camelCase)', () => {
        expect(mapName(undefined, 'camelCase')({ name: 'FirstName' })).toStrictEqual('firstName');
    });

    it('Default case should be used when resolver is undefined (pascalCase)', () => {
        expect(mapName(undefined, 'pascalCase')({ name: 'firstName' })).toStrictEqual('FirstName');
    });

    it('Given case should be used instead of default one (camelCase)', () => {
        expect(mapName('camelCase', 'pascalCase')({ name: 'FirstName' })).toStrictEqual('firstName');
    });

    it('Given case should be used instead of default one (pascalCase)', () => {
        expect(mapName('pascalCase', 'camelCase')({ name: 'firstName' })).toStrictEqual('FirstName');
    });
});

describe('Resolvers - resolvePropertyName', () => {
    it('Property name should always be in camelCase', () => {
        expect(resolvePropertyName('FirstName')).toStrictEqual('firstName');
    });

    it('Property name should have special characters stripped', () => {
        expect(resolvePropertyName('#FirstName')).toStrictEqual('firstName');
        expect(resolvePropertyName('.FirstName')).toStrictEqual('firstName');
        expect(resolvePropertyName(' FirstName#?!')).toStrictEqual('firstName');
    });

    it('Property name should be prefixed with underscore when it starts with number characters', () => {
        expect(resolvePropertyName('1FirstName')).toStrictEqual('_1FirstName');
        expect(resolvePropertyName('111FirstName')).toStrictEqual('_111FirstName');
    });

    it('Random string should be generated when property name is empty', () => {
        expect(resolvePropertyName('').length).toBeGreaterThan(0);
        expect(resolvePropertyName('').length).toBeLessThan(15);
    });
});

describe('Resolvers - mapFilename', () => {
    it('File extension should be added', () => {
        expect(mapFilename((item) => `${item.codename}`)({ codename: 'x' }, true)).toStrictEqual('x.ts');
    });

    it('File extension should not be added', () => {
        expect(mapFilename((item) => `${item.codename}`)({ codename: 'x' }, false)).toStrictEqual('x');
    });

    it('Codename should be used as is when resolver is undefined', () => {
        expect(mapFilename(undefined)({ codename: 'firstName' }, true)).toStrictEqual('firstName.ts');
    });

    it('Filename should be in camelCase', () => {
        expect(mapFilename('camelCase')({ codename: 'FirstName' }, true)).toStrictEqual('firstName.ts');
    });

    it('Filename should be in pascalCase', () => {
        expect(mapFilename('pascalCase')({ codename: 'firstName' }, true)).toStrictEqual('FirstName.ts');
    });
});

describe('Resolvers - camelCase', () => {
    it('should resolve single word to camelCase', () => {
        expect(resolveCase('Name', 'camelCase')).toStrictEqual('name');
    });

    it('should resolve multiple words to camelCase', () => {
        expect(resolveCase('First Name', 'camelCase')).toStrictEqual('firstName');
    });

    it('should resolve snake_case to camelCase', () => {
        expect(resolveCase('first_name', 'camelCase')).toStrictEqual('firstName');
    });

    it('should resolve kebab-case to camelCase', () => {
        expect(resolveCase('first-name', 'camelCase')).toStrictEqual('firstName');
    });

    it('should resolve mixed case to camelCase', () => {
        expect(resolveCase('FirstName', 'camelCase')).toStrictEqual('firstName');
    });

    it('should resolve uppercase to camelCase', () => {
        expect(resolveCase('FIRSTNAME', 'camelCase')).toStrictEqual('fIRSTNAME');
    });

    it('should resolve camelCase to camelCase', () => {
        expect(resolveCase('firstName', 'camelCase')).toStrictEqual('firstName');
    });

    it('should resolve string with special characters to camelCase', () => {
        expect(resolveCase('first@name', 'camelCase')).toStrictEqual('firstName');
    });

    it('should resolve string with numbers to camelCase', () => {
        expect(resolveCase('first1name', 'camelCase')).toStrictEqual('first1Name');
    });

    it('should resolve string with spaces and special characters to camelCase', () => {
        expect(resolveCase('first name@last', 'camelCase')).toStrictEqual('firstNameLast');
    });
});

describe('Resolvers - pascalCase', () => {
    it('should resolve single word to PascalCase', () => {
        expect(resolveCase('name', 'pascalCase')).toStrictEqual('Name');
    });

    it('should resolve multiple words to PascalCase', () => {
        expect(resolveCase('first name', 'pascalCase')).toStrictEqual('FirstName');
    });

    it('should resolve snake_case to PascalCase', () => {
        expect(resolveCase('first_name', 'pascalCase')).toStrictEqual('FirstName');
    });

    it('should resolve kebab-case to PascalCase', () => {
        expect(resolveCase('first-name', 'pascalCase')).toStrictEqual('FirstName');
    });

    it('should resolve mixed case to PascalCase', () => {
        expect(resolveCase('FirstName', 'pascalCase')).toStrictEqual('FirstName');
    });

    it('should resolve uppercase to PascalCase', () => {
        expect(resolveCase('FIRSTNAME', 'pascalCase')).toStrictEqual('FIRSTNAME');
    });

    it('should resolve camelCase to PascalCase', () => {
        expect(resolveCase('firstName', 'pascalCase')).toStrictEqual('FirstName');
    });

    it('should resolve string with special characters to PascalCase', () => {
        expect(resolveCase('first@name', 'pascalCase')).toStrictEqual('FirstName');
    });

    it('should resolve string with numbers to PascalCase', () => {
        expect(resolveCase('first1name', 'pascalCase')).toStrictEqual('First1Name');
    });

    it('should resolve string with spaces and special characters to PascalCase', () => {
        expect(resolveCase('first name@last', 'pascalCase')).toStrictEqual('FirstNameLast');
    });
});
