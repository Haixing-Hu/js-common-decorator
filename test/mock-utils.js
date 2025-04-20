////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 存储被模拟的原始方法，用于恢复
 */
const originalMethods = new Map();

/**
 * 模拟一个对象的方法
 *
 * @param {object} obj - 要模拟的对象
 * @param {string} methodName - 方法名
 * @param {function} mockImplementation - 模拟实现
 * @returns {function} - 返回模拟方法
 */
export function spy(obj, methodName, mockImplementation) {
  const originalMethod = obj[methodName];
  const key = `${obj.constructor?.name || 'unknown'}.${methodName}`;
  originalMethods.set(key, { obj, methodName, originalMethod });

  const mockMethod = jest.fn(mockImplementation);
  obj[methodName] = mockMethod;

  return mockMethod;
}

/**
 * 恢复所有被模拟的方法
 */
export function restore() {
  for (const [, { obj, methodName, originalMethod }] of originalMethods) {
    if (originalMethod) {
      obj[methodName] = originalMethod;
    }
  }
  originalMethods.clear();
}
