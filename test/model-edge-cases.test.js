////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Model from '../src/model';

/**
 * 测试Model装饰器的边缘情况，特别是测试模型的基本功能
 */
describe('Model edge cases', () => {
  it('should create a model with proper prototype methods', () => {
    @Model
    class TestModel {
      id = '';

      name = '';
    }

    // 检查实例方法是否已添加
    expect(typeof TestModel.prototype.assign).toBe('function');
    expect(typeof TestModel.prototype.clear).toBe('function');
    expect(typeof TestModel.prototype.clone).toBe('function');
    expect(typeof TestModel.prototype.validate).toBe('function');
    expect(typeof TestModel.prototype.normalize).toBe('function');
  });

  it('should provide a static create method', () => {
    @Model
    class TestModel {
      id = '';

      name = '';
    }

    // 使用静态create方法创建实例
    const instance = TestModel.create({ id: '123', name: 'Test' });

    // 验证实例类型和属性
    expect(instance).toBeInstanceOf(TestModel);
    expect(instance.id).toBe('123');
    expect(instance.name).toBe('Test');
  });
});
