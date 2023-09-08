/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

const CreateArrayImpl = {
  /**
   * 根据给定的对象数组创建一个新的实例数组，其中每个元素的属性值从给定数组对应
   * 元素的属性值复制而来，但其原型和类定义时的原型保持一致。
   *
   * @param {Function} Class
   *     指定的类的构造器。
   * @param {Array} array
   *     指定的对象数组。
   * @param {Boolean} normalizable
   *     是否对创建的数组中的实例进行正则化。
   * @return {Array}
   *     创建的指定类的实例数组。
   */
  create(Class, array, normalizable) {
    // console.log('CreateArrayImpl.create: Class = ', Class,
    //   ', array = ', array, ', Array.isArray(array) = ', Array.isArray(array));
    if (array === undefined || array === null) {
      return null;
    } else if (Array.isArray(array)) {
      // 处理标准数组
      return array.map((e) => Class.create(e, normalizable));
    // 不需要特殊处理Vue托管的数组
    // } else if (Object.prototype.toString.call(array) === '[object Array]') {
    //   // 处理Vue托管数组
    //   const result = [];
    //   for (let index in array) {
    //     const e = array[index];
    //     const obj = Class.create(e, normalizable);
    //     result.push(obj);
    //   }
    //   return result;
    } else {
      throw new TypeError(`The argument of ${Class.name}.createArray() is not an array.`);
    }
  },
};

export default CreateArrayImpl;
