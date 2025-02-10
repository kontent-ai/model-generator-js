import { describe, expect, it } from 'vitest';
import { resolveCase } from '../lib/public_api.js';

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
