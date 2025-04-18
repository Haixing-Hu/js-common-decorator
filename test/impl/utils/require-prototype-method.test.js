////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import requirePrototypeMethod from '../../../src/impl/utils/require-prototype-method';

describe('requirePrototypeMethod', () => {
  class ParentClass {
    parentMethod() {
      return 'parent';
    }
  }

  class ChildClass extends ParentClass {
    childMethod() {
      return 'child';
    }
  }

  test('should not throw when the class has the specified prototype method', () => {
    expect(() => requirePrototypeMethod(ChildClass, 'childMethod')).not.toThrow();
  });

  test('should not throw when the parent class has the specified prototype method', () => {
    expect(() => requirePrototypeMethod(ChildClass, 'parentMethod')).not.toThrow();
  });

  test('should throw TypeError when neither the class nor its parent classes have the specified prototype method', () => {
    expect(() => requirePrototypeMethod(ChildClass, 'nonExistingMethod')).toThrow(TypeError);
    expect(() => requirePrototypeMethod(ChildClass, 'nonExistingMethod')).toThrow(
      `The class ChildClass does not implement the prototype method "nonExistingMethod()".`
    );
  });

  test('should throw TypeError for non-class inputs', () => {
    const obj = {};
    expect(() => requirePrototypeMethod(obj, 'toString')).toThrow(TypeError);
  });

  test('should throw TypeError with class name included in error message', () => {
    class SpecialClass {}
    expect(() => requirePrototypeMethod(SpecialClass, 'specialMethod')).toThrow(
      `The class SpecialClass does not implement the prototype method "specialMethod()".`
    );
  });
}); 