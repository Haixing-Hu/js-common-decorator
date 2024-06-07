////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { DefaultOptions } from '../src';

/**
 * This is used for testing the `DefaultOptions`.
 *
 * @author Haixing Hu
 */
describe('Test the `DefaultOptions`', () => {
  test('Test DefaultOptions.get()', () => {
    const opt1 = DefaultOptions.get('assign');
    expect(opt1).not.toBeUndefined();
    expect(opt1.convertNaming).toBe(false);
    opt1.convertNaming = true;
    const opt2 = DefaultOptions.get('assign');
    expect(opt2).not.toBeUndefined();
    expect(opt2.convertNaming).toBe(false);
  });
  test('Test DefaultOptions.get() with non-exist aspect', () => {
    const opt1 = DefaultOptions.get('xxx');
    expect(opt1).toBeUndefined();
  });
  test('Test DefaultOptions.merge()', () => {
    const opt1 = DefaultOptions.get('assign');
    expect(opt1).not.toBeUndefined();
    expect(opt1.convertNaming).toBe(false);
    const opt2 = DefaultOptions.merge('assign', { convertNaming: true });
    expect(opt2).not.toBeUndefined();
    expect(opt2.convertNaming).toBe(true);
    expect(opt1.convertNaming).toBe(false);
    const opt3 = DefaultOptions.merge('assign', null);
    expect(opt3).not.toBeUndefined();
    expect(opt3.convertNaming).toBe(false);
  });
  test('Test DefaultOptions.merge() with non-exist aspect', () => {
    const opt1 = DefaultOptions.merge('xxx', { convertNaming: true });
    expect(opt1).not.toBeUndefined();
    expect(opt1.convertNaming).toBe(true);
    const opt2 = DefaultOptions.get('xxx');
    expect(opt2).toBeUndefined();
  });
  test('Test DefaultOptions.set()', () => {
    const opt1 = DefaultOptions.get('assign');
    expect(opt1).not.toBeUndefined();
    expect(opt1.convertNaming).toBe(false);
    DefaultOptions.set('assign', { convertNaming: true, yyy: 'yyy' });
    const opt2 = DefaultOptions.get('assign');
    expect(opt2).not.toBeUndefined();
    expect(opt2.convertNaming).toBe(true);
    expect(opt2.yyy).toBe('yyy');
    expect(opt1.convertNaming).toBe(false);
  });
  test('Test DefaultOptions.set() with non-exist aspect', () => {
    DefaultOptions.set('xxx', { convertNaming: true });
    const opt = DefaultOptions.get('xxx');
    expect(opt).not.toBeUndefined();
    expect(opt.convertNaming).toBe(true);
  });
});
