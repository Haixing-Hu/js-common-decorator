////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { toJSON, DefaultOptions } from '../src';

describe('toJSON', () => {
  it('should serialize a simple object', () => {
    const obj = { a: 1, b: 'test' };
    const result = toJSON(obj);
    expect(result).toEqual(obj);
  });

  it('should remove empty fields if removeEmptyFields is true', () => {
    const obj = { a: 1, b: '', c: null, d: undefined };
    const options = { removeEmptyFields: true };
    const result = toJSON(obj, options);
    expect(result).toEqual({ a: 1 });
  });

  it('should not remove empty fields if removeEmptyFields is false', () => {
    const obj = { a: 1, b: '', c: null, d: undefined };
    const options = { removeEmptyFields: false };
    const result = toJSON(obj, options);
    expect(result).toEqual(obj);
  });

  it('should normalize the object if normalize is true', () => {
    class Foo {
      constructor(a, b) {
        this.a = a;
        this.b = b;
      }

      normalize() {
        this.b = this.b.toUpperCase();
      }
    }
    const obj = new Foo(1, 'test');
    const options = { normalize: true };
    const result = toJSON(obj, options);
    expect(result).toEqual({ a: 1, b: 'TEST' });
  });

  it('should convert naming styles if convertNaming is true', () => {
    const obj = { myProperty: 1 };
    const options = {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_CAMEL',
      targetNamingStyle: 'LOWER_UNDERSCORE',
    };
    const result = toJSON(obj, options);
    expect(result).toEqual({ my_property: 1 });
  });

  it('should use default options if options are null or undefined', () => {
    const obj = { a: 1, b: 'test' };
    const defaultOptions = DefaultOptions.get('toJSON');
    const resultWithNull = toJSON(obj, null);
    const resultWithUndefined = toJSON(obj, undefined);
    expect(resultWithNull).toEqual(toJSON(obj, defaultOptions));
    expect(resultWithUndefined).toEqual(toJSON(obj, defaultOptions));
  });

  it('should handle non-object values correctly', () => {
    expect(toJSON(null)).toBeNull();
    expect(toJSON(undefined)).toBeUndefined();
    expect(toJSON(123)).toBe(123);
    expect(toJSON('test')).toBe('test');
  });

  it('should handle objects with root toJSON method', () => {
    class Foo {
      a = 1;

      toJSON() {
        return { b: 2 };
      }
    }
    const obj = new Foo();
    const result = toJSON(obj);
    expect(result).toEqual({ b: 2 });
  });

  it('should handle objects with nested toJSON method', () => {
    class Bar {
      b = 2;

      toJSON() {
        return { c: 3 };
      }
    }
    class Foo {
      a = 1;

      bar = new Bar();
    }
    const obj = new Foo();
    const result = toJSON(obj);
    expect(result).toEqual({ a: 1, bar: { c: 3 } });
  });

  it('should modify the original object even if the normalize option is set', () => {
    class Foo {
      constructor(a, b) {
        this.a = a;
        this.b = b;
      }

      normalize() {
        this.b = this.b.toUpperCase();
      }
    }
    const obj = new Foo(1, 'test');
    const options = { normalize: true };
    const result = toJSON(obj, options);
    expect(obj).toEqual({ a: 1, b: 'test' });
    expect(result).toEqual({ a: 1, b: 'TEST' });
  });
});
