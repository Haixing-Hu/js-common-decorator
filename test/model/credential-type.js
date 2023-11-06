////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum } from '../../src';

/**
 * 此枚举表示证件类型。
 *
 * @author 胡海星
 */
@Enum
class CredentialType {
  static IDENTITY_CARD = '身份证';

  static PASSPORT = '护照';

  static OFFICER_CARD = '中国人民解放军军官证';

  static POLICE_CARD = '中国人民武装警察警官证';

  static HONGKONG_PASSPORT = '香港特区护照/身份证明';

  static MACAO_PASSPORT = '澳门特区护照/身份证明';

  static TAIWAN_RETURN_PERMIT = '台湾居民来往大陆通行证';

  static FOREIGNER_PERMANENT_RESIDENCE_PERMIT = '外国人永久居住证';

  static HONGKONG_MACAO_TAIWAN_RESIDENCE_PERMIT = '港澳台居住证';

  static OTHER = '其他证件';

  /**
   * The default credential type.
   *
   * Note that the static property cannot be used here, because the enumerator
   * has not been defined by the decorator `@Enum` when it is parsed here.
   * Therefore, we can only use a static getter to return the default
   * enumerator dynamically.
   */
  static get DEFAULT() {
    return CredentialType.IDENTITY_CARD;
  }
}

export default CredentialType;
