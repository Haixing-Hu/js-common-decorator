/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Enum } from '../../main';

/**
 * 此枚举表示证件类型。
 *
 * @author 胡海星
 */
@Enum([{
  name: '身份证',
  value: 'IDENTITY_CARD',
}, {
  name: '护照',
  value: 'PASSPORT',
}, {
  name: '中国人民解放军军官证',
  value: 'OFFICER_CARD',
}, {
  name: '中国人民武装警察警官证',
  value: 'POLICE_CARD',
}, {
  name: '香港特区护照/身份证明',
  value: 'HONGKONG_PASSPORT',
}, {
  name: '澳门特区护照/身份证明',
  value: 'MACAO_PASSPORT',
}, {
  name: '台湾居民来往大陆通行证',
  value: 'TAIWAN_RETURN_PERMIT',
}, {
  name: '外国人永久居住证',
  value: 'FOREIGNER_PERMANENT_RESIDENCE_PERMIT',
}, {
  name: '港澳台居住证',
  value: 'HONGKONG_MACAO_TAIWAN_RESIDENCE_PERMIT',
}, {
  name: '其他证件',
  value: 'OTHER',
}])
class CredentialType {
  /**
   * 默认的证件类型枚举。
   *
   * 注意这里不能用static property定义，因为解析到此处时枚举子尚未被装饰器
   * `@Enum`定义。因此只能用getter动态返回枚举子。
   */
  static get DEFAULT() {
    return CredentialType.IDENTITY_CARD;
  }
}

export default CredentialType;
