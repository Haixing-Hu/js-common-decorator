////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Test the `DefaultOptions.reset()` method
 */

import DefaultOptions from '../src/default-options';
import DefaultAssignmentOptions from '../src/impl/default-options/default-assignment-options';
import DefaultToJsonOptions from '../src/impl/default-options/default-to-json-options';

describe('Test DefaultOptions.reset()', () => {
  beforeEach(() => {
    // 清除现有设置，确保每个测试都从干净的环境开始
    DefaultOptions.reset();
  });

  test('Test DefaultOptions.reset() without arguments', () => {
    // 首先设置一些自定义选项
    DefaultOptions.set('assign', { normalize: false });
    DefaultOptions.set('toJSON', { removeEmptyFields: true });

    // 确认设置已应用
    expect(DefaultOptions.get('assign').normalize).toBe(false);
    expect(DefaultOptions.get('toJSON').removeEmptyFields).toBe(true);

    // 重置所有选项
    DefaultOptions.reset();

    // 验证所有选项已恢复为默认值
    expect(DefaultOptions.get('assign')).toBeInstanceOf(DefaultAssignmentOptions);
    expect(DefaultOptions.get('assign').normalize).toBe(true);
    expect(DefaultOptions.get('toJSON')).toBeInstanceOf(DefaultToJsonOptions);
    expect(DefaultOptions.get('toJSON').removeEmptyFields).toBe(false);
  });

  test('Test DefaultOptions.reset() with specific aspect', () => {
    // 首先设置一些自定义选项
    DefaultOptions.set('assign', { normalize: false });
    DefaultOptions.set('toJSON', { removeEmptyFields: true });

    // 确认设置已应用
    expect(DefaultOptions.get('assign').normalize).toBe(false);
    expect(DefaultOptions.get('toJSON').removeEmptyFields).toBe(true);

    // 只重置assign方面的选项
    DefaultOptions.reset('assign');

    // 验证assign选项已恢复为默认值，而toJSON选项保持自定义值
    expect(DefaultOptions.get('assign')).toBeInstanceOf(DefaultAssignmentOptions);
    expect(DefaultOptions.get('assign').normalize).toBe(true);
    expect(DefaultOptions.get('toJSON').removeEmptyFields).toBe(true);

    // 然后重置toJSON方面的选项
    DefaultOptions.reset('toJSON');

    // 验证toJSON选项也已恢复为默认值
    expect(DefaultOptions.get('toJSON')).toBeInstanceOf(DefaultToJsonOptions);
    expect(DefaultOptions.get('toJSON').removeEmptyFields).toBe(false);
  });

  test('Test DefaultOptions.reset() with unknown aspect', () => {
    // 测试用未知的aspect调用reset()方法时会抛出错误
    expect(() => {
      DefaultOptions.reset('unknownAspect');
    }).toThrow('Unknown aspect: unknownAspect');
  });
});
