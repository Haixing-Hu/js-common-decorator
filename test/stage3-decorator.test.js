////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// The following polyfill is required to support the decorator metadata proposal.
// see:
// [1] https://github.com/babel/babel/issues/16838
// [2] https://github.com/babel/website/blob/26139b82ac19e258c806db3de4f33844bd0abda1/docs/plugin-proposal-decorators.md#note-on-symbolmetadata
import 'core-js/proposals/decorator-metadata-v2.js';
import classMetadataCache from '../src/impl/class-metadata-cache';

const metadataSymbol = Symbol.metadata;

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
    expect(classMetadataCache.get(C)).toBe(C[metadataSymbol]);
    expect(C[metadataSymbol].a).toBe('x');
    @meta('a', 'z')
    class D extends C {
      m() {}
    }
    expect(D[metadataSymbol].a).toBe('z');
    expect(C[metadataSymbol].a).toBe('x');
  });

  test('Test the decorator of class field', () => {
    function foo(field, context) {
      context.metadata[context.name] = 'ok';
      return function initializer(initialValue) {
        console.log(`Initialize the ${context.name} with initial value ${initialValue}`);
      };
    }
    class A {
      @foo
      x = 1;

      @foo
      y = 'hello';

      @foo
      z;
    }
    expect(A[metadataSymbol].x).toBe('ok');
    expect(A[metadataSymbol].y).toBe('ok');
    expect(A[metadataSymbol].z).toBe('ok');
  });

  test('Decorators applying order', () => {
    function test(target, context) {
      console.log(`Apply @test on ${context.name}`);
      if (context.kind === 'class') {
        console.log('Object.keys(Foo):', Object.keys(target));
        console.log('Object.keys(Foo.prototype):', Object.keys(target.prototype));
        console.log('Foo.INSTANCE:', target.INSTANCE);
      }
    }

    @test
    class Foo {
      @test
      x = 0;

      @test
      foo() {
        console.log('foo');
      }

      @test
      static INSTANCE = new Foo();
    }

    const f = new Foo();
    f.foo();
  });
});
