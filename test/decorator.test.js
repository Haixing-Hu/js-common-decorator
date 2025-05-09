////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/* eslint-disable no-unused-vars */

const kind = {};

/**
 * This is used for testing the bug in `@babel/helpers` > 7.23.0. See #16179, #16180.
 *
 * @author Haixing Hu
 */
describe('Test the context.kind', () => {
  test('Test class decorator', () => {
    function ClassDecorator(target, context) {
      kind['class'] = context.kind;
    }
    @ClassDecorator
    class Foo {}
    expect(kind['class']).toBe('class');
  });
  test('Test class field decorator', () => {
    function FieldDecorator(target, context) {
      kind['field'] = context.kind;
    }
    class Foo {
      @FieldDecorator
      x = 0;
    }
    expect(kind['field']).toBe('field');
  });
  test('Test class method decorator', () => {
    function MethodDecorator(target, context) {
      kind['method'] = context.kind;
    }
    class Foo {
      @MethodDecorator
      hello() {}
    }
    expect(kind['method']).toBe('method');
  });
  test('Test getter decorator', () => {
    function GetterDecorator(target, context) {
      kind['getter'] = context.kind;
    }
    class Foo {
      @GetterDecorator
      get x() { return 0; }
    }
    expect(kind['getter']).toBe('getter');
  });
  test('Test setter decorator', () => {
    function SetterDecorator(target, context) {
      kind['setter'] = context.kind;
    }
    class Foo {
      _x = 0;

      @SetterDecorator
      set x(v) { this._x = v; }
    }
    expect(kind['setter']).toBe('setter');
  });
});
