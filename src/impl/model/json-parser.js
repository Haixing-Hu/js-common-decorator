////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import JsonBigint from 'json-bigint';

/**
 * 某些模型的ID字段使用了64位整数表示，但Javascript只能表示52位整数，因此必须使用JSONbig库
 * 提供对64位整数的支持。
 *
 * @private
 * @author 胡海星
 */
const jsonParser = JsonBigint({
  storeAsString: false,   // 把64位整数存储为 bigint 类型
  useNativeBigInt: true,  // 使用原生的 bigint 类型
});

export default jsonParser;
