/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { setClassMetadata, getClassMetadata } from './utils';

const GenerateIdImpl = {
  /**
   * 为指定的对象生成独一的ID。
   *
   * @param {Function} Class
   *     指定的类的构造函数。
   * @param {Object} obj
   *     指定的对象，其`id`属性将被设置为新生成的ID。
   * @return {String}
   *     生成的ID。
   */
  generate(Class, obj) {
    const id = getClassMetadata(Class, 'next_id');
    obj.id = id.toString();
    setClassMetadata(Class, 'next_id', id + 1);
    return obj.id;
  },
};

export default GenerateIdImpl;
