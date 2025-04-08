const { setupSearchForm, handleFileSelect, parseToJson, findInJson, parseToText } = require('./methods');

// Test for parseToJson function
describe('parseToJson function', () => {
  test('correctly parses valid input', () => {
    const input = 'key value\n';
    const result = parseToJson(input);
    expect(result).toEqual({ key: 'value' });
  });

  test('throws error on duplicate key', () => {
    const input = 'key value1\nkey value2\n';
    expect(() => parseToJson(input)).toThrowError('El archivo contiene una clave duplicada: key');
  });

  test('throws error on incomplete curly brace', () => {
    const input = 'key value1\nkey2 {\nkey3 value3\n';
    expect(() => parseToJson(input)).toThrowError('Hay una llave de apertura { sin una llave de cierre correspondiente');
  });
});

// Test for findInJson function
describe('findInJson function', () => {
  const json = { a: { b: { c: 'test' } } };

  test('finds nested value', () => {
    const result = findInJson(json, 'c');
    expect(result).toBe('test');
  });

  test('returns null for non-existent key', () => {
    const result = findInJson(json, 'nonExistent');
    expect(result).toBeNull();
  });
});

// Test for parseToText function
describe('parseToText function', () => {
  test('converts object to formatted text', () => {
    const obj = { a: true, b: ['one', 'two'] };
    const result = parseToText(obj, 'test');
    expect(result).toContain('a');
    expect(result).toContain('b one two');
    expect(result).toBe(`test {\n    a\n    b one two\n}\n`);
  });
});