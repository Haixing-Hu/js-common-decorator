////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import metadataSymbol from '../src/impl/symbol-metadata';

describe('Test the feature of the stage 3 decorator', () => {
  test('The Symbol.metadata must exist', () => {
    expect(Symbol.metadata).toBeDefined();
  });
  test('Test the inheritance of metadata', () => {
    function meta(key, value) {
      return (Class, context) => {
        context.metadata[key] = value;
        console.log('context.metadata', context.metadata);
        console.log('Class:', Class);
        console.log('Class[Symbol.metadata]', Class[metadataSymbol]);
        const Parent = Object.getPrototypeOf(Class);
        if (Parent !== null) {
          console.log('Parent:', Parent);
          console.log('Parent[Symbol.metadata]', Parent[metadataSymbol]);
        }
      };
    }

    @meta('a', 'x')
    class C {
      m() {}
    }

    expect(C[metadataSymbol].a).toBe('x');

    @meta('a', 'z')
    class D extends C {
      m() {}
    }

    expect(D[metadataSymbol].a).toBe('z');
    expect(C[metadataSymbol].a).toBe('x');
  });
});
