////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isUndefinedOrNull from '@haixing_hu/common-util/src/is-undefined-or-null';
import deepEqual from '@haixing_hu/common-util/src/deep-equal';
import {
  setClassMetadata,
  getDefaultInstance,
  hasOwnPrototypeFunction,
  hasPrototypeFunction,
} from './impl/utils';
import AssignImpl from './impl/assign-impl';
import NormalizeImpl from './impl/normalize-impl';
import ValidateImpl from './impl/validate-impl';
import EqualsImpl from './impl/equals-impl';
import GenerateIdImpl from './impl/generate-id-impl';
import CreateArrayImpl from './impl/create-array-impl';
import Page from './models/Page';

/**
 * 修饰领域类，为其增加常用方法。
 *
 * 此装饰器会为被装饰的类添加下述方法：
 *
 * - 实例方法`assign(obj, normalizable)`：将对象obj的属性复制到此对象，只复制此
 *   对象所属类中定义的属性，如果`obj`对象的某个属性为`undefined`或`null`，则会
 *   将此对象的该属性值设置为默认值。该函数的返回值是此对象本身。注意`obj`对象可
 *   以和此对象有不同的原型。参数`normalizable`表示是否要在复制属性后对此对象进
 *   行正则化，默认值为`true`。
 * - 实例方法`clear()`：将此对象的所有属性值设置为默认值。
 * - 实例方法`clone()`：返回此对象的深度克隆。
 * - 实例方法`isEmpty()`：判定此对象是否为空，即其属性值是否全部都是默认值。
 * - 实例方法`equals(obj)`：判定此对象与`obj`是否深度相等。
 * - 实例方法`normalize(field)`：对此对象的指定字段进行正则化，参数`field`是指
 *   定的待正则化的字段的名称；如果`field`是`undefined`或`null`或字符串`"*"`，则
 *   对该对象所有可正则化的字段进行正则化；如果`field`是一个字符串数组，则该数组
 *   中所有可正则化的字段进行正则化。该函数的返回值是此对象本身。注意，某个字段
 *   要可被正则化，必须通过`@{@link Normalizer}`装饰器指定其正则化函数。
 * - 实例方法`validate(field, options)`：对指定实例的指定字段进行校验；参数
 *   `field`是待校验的字段名称，如果`field`是`undefined`或`null`或字符串`"*"`，
 *   则对指定对象所有可校验的字段进行校验；如果`field`是一个字符串数组，则对该数
 *   组中所有可校验的字段进行校验；注意，某个字段要可被校验，必须通过
 *   `@{@link Validator}`装饰器指定其校验函数。参数`options`是额外参数构成的对象，
 *   其属性值将会被合并到校验函数的第二个参数中传递给校验函数，具体可参见
 *   `@{@link Validator}`的文档。
 * - 实例方法`generateId()`：如果被装饰的类定义了名称为`id`的属性，则此装饰器会
 *   自动为其增加一个`generateId()`实例方法，该方法每调用一次会为当前调用对象生
 *   成一个全局唯一的ID（一个整数的字符串表示形式），并且将其返回。注意，如果某
 *   个父类`A`中定义了`id`字段，子类`B`中没有定义`id`字段仅继承了父类的`id`字段，
 *   则仅在父类`A`中添加`generateId()`方法，子类`B`中不会添加。
 * - 静态类方法`create(obj, normalizable)`：根据对象`obj`创建一个新的实例对象，其
 *   属性值从`obj` 对应的属性值中复制而来，但其原型和类定义时的原型保持一致。此方
 *   法用于将一个普通的JOSN对象转化为指定的领域对象。参数`normalizable`表示是否要
 *   对返回的对象进行正则化，默认值为`true`。
 * - 静态类方法`createArray(array, normalizable)`：根据对象数组`array`创建一个新
 *   的实例数组，其中每个元素的属性值从`array`对应元素的属性值复制而来，但其原型和
 *   类定义时的原型保持一致。此方法用于将一个普通的JSON对象数组转化为指定的领域对
 *   象数组。参数`normalizable`表示是否要对返回的数组中的每个对象进行正则化，默认
 *   值为`true`。
 * - 静态类方法`createPage(page)`：根据分页对象`page`创建一个新的分页对象。通常
 *   page是从服务器通过GET方法获取的领域对象的分页列表，该对象包含的属性应符合
 *   `Page`类的定义。此静态类方法将返回一个新的`Page`对象，其`content`属性是
 *   `createArray(page.content, true)`的返回结果，其他属性和page对象一致。如果
 *   参数不是合法的`Page`对象，则返回`null`。
 * - 静态类方法`nullOrEmpty(obj)`：判定给定的实例是否是`undefined`或`null`或默认
 *   构造的空对象。
 *
 * 注意：如果被装饰的类已经实现了上述方法，此装饰器不会覆盖被装饰类自己实现的方
 * 法。
 *
 * 使用示例：
 * ```js
 * &#064;Model
 * class Credential {
 *
 *   &#064;EnumNormalizer
 *   &#064;Validator(validateCredentialTypeField)
 *   &#064;Type(CredentialType)
 *   &#064;DisplayName('证件类型')
 *   type = 'IDENTITY_CARD';
 *
 *   &#064;Normalizer(trimUppercaseString)
 *   &#064;Validator(validateCredentialNumberField)
 *   &#064;DisplayName('证件号码')
 *   number = '';
 *
 *   constructor(type = CredentialType.DEFAULT.value, number = '') {
 *     this.type = type;
 *     this.number = number;
 *   }
 *
 *   isIdentityCard() {
 *     return (this.type === 'IDENTITY_CARD');
 *   }
 * }
 *
 * &#064;Model
 * class Person {
 *
 *   &#064;Normalizer(trimString)
 *   &#064;DisplayName('ID')
 *   id = null;
 *
 *   &#064;Normalizer(trimUppercaseString)
 *   &#064;Validator(validatePersonNameField)
 *   &#064;DisplayName('姓名')
 *   name = '';
 *
 *   &#064;DefaultNormalizer
 *   &#064;DefaultValidator
 *   &#064;Type(Credential)
 *   &#064;DisplayName('证件')
 *   credential = null;
 *
 *   &#064;EnumNormalizer
 *   &#064;Validator(validatePersonGenderField)
 *   &#064;Type(Gender)
 *   &#064;DisplayName('性别')
 *   gender = '';
 *
 *   &#064;Normalizer(trimString)
 *   &#064;Validator(validatePersonBirthdayField)
 *   &#064;DisplayName('出生日期')
 *   birthday = '';
 *
 *   &#064;Normalizer(trimUppercaseString)
 *   &#064;Validator(validateMobileField)
 *   &#064;DisplayName('手机号码')
 *   mobile = '';
 *
 *   &#064;Normalizer(trimString)
 *   &#064;Validator(validateEmailField)
 *   &#064;DisplayName('电子邮件地址')
 *   &#064;Nullable
 *   email = '';
 *
 *   equals(other) {
 *     if (!(other instanceof PersonWithEquals)) {
 *       return false;
 *     }
 *     if ((this.credential === null) || (other.credential === null)) {
 *       // 若两人之一无身份证信息，无法比较他们是否同一人，认为不同
 *       return false;
 *     }
 *     return (this.credential.type === other.credential.type)
 *       && (this.credential.number === other.credential.number);
 *    }
 *  }
 * }
 * ```
 *
 * 使用`@Model`装饰器后，会自动添加下述方法：
 * - `Credential.prototype.assign(obj, normalizable)`
 * - `Credential.prototype.clear()`
 * - `Credential.prototype.clone()`
 * - `Credential.prototype.isEmpty()`
 * - `Credential.prototype.equals()`
 * - `Credential.prototype.normalize(field)`
 * - `Credential.prototype.validate(field, ...args)`
 * - `Credential.create(obj)`
 * - `Credential.createArray(array)`
 * - `Credential.nullOrEmpty(obj)`
 * - `Person.prototype.assign(obj)`
 * - `Person.prototype.clear()`
 * - `Person.prototype.clone()`
 * - `Person.prototype.isEmpty()`
 * - `Person.prototype.normalize(field)`
 * - `Person.prototype.validate(field, ...args)`
 * - `Person.prototype.generateId()`
 * - `Person.create(obj, normalizable)`
 * - `Person.createArray(array, normalizable)`
 * - `Person.createPage(page)`
 * - `Person.nullOrEmpty(obj)`
 *
 * 注意，
 * - 因为`Credential`类没有`id`属性，因此`@Model`装饰器不会为其增加`generateId()`
 *   实例方法。
 * - 因为`Person`已经实现了`Person.prototype.equals()`方法，所以`@Model`装饰
 *   器不会覆盖其自己实现的`Person.prototype.equals()`方法。
 *
 * @param {Function} Class
 *     目标对象所属的类的构造函数。
 * @author 胡海星
 * @see Type
 * @see ElementType
 * @see Normalizer
 * @see Validator
 * @see ValidationResult
 */
export function Model(Class) {
  // 被@Model修饰的类的category分类设置为'model'
  setClassMetadata(Class, 'category', 'model');
  // 添加默认构造的实例作为类的静态成员
  const defaultInstance = getDefaultInstance(Class);
  // console.log('@Model: Class = ', Class, ',
  //    defaultInstance = ', defaultInstance);
  // 添加 assign() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'assign')) {
    Class.prototype.assign = function assign(obj, normalizable = true) {
      return AssignImpl.assign(Class.name, this, obj, defaultInstance, normalizable);
    };
  }
  // 添加 clear() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'clear')) {
    Class.prototype.clear = function clear() {
      return this.assign(defaultInstance);
    };
  }
  // 添加 clone() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'clone')) {
    Class.prototype.clone = function clone() {
      return new Class().assign(this);
    };
  }
  // 添加 isEmpty() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'isEmpty')) {
    Class.prototype.isEmpty = function isEmpty() {
      return deepEqual(this, defaultInstance);
    };
  }
  // 添加 equals() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'equals')) {
    Class.prototype.equals = function equals(obj) {
      return EqualsImpl.equals(this, obj);
    };
  }
  // 添加 normalize() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'normalize')) {
    Class.prototype.normalize = function normalize(field = '*') {
      return NormalizeImpl.normalize(Class, this, field);
    };
  }
  // 添加 validate() 实例方法
  if (!hasOwnPrototypeFunction(Class, 'validate')) {
    Class.prototype.validate = function validate(field = '*', options = {}) {
      return ValidateImpl.validate(Class, this, field, options);
    };
  }
  // 为包含id字段的类添加 generateId() 实例方法
  if (Object.hasOwn(defaultInstance, 'id')                // 自身实例有id字段
      && !hasPrototypeFunction(Class, 'generateId')) {    // 自身或其父类原型没有generateId()方法
    setClassMetadata(Class, 'next_id', 0);
    Class.prototype.generateId = function generateId() {
      return GenerateIdImpl.generate(Class, this);
    };
  }
  // 添加 create() 静态方法
  if (!Object.hasOwn(Class, 'create')) {
    Class.create = function create(obj, normalizable = true) {
      return isUndefinedOrNull(obj) ? null : new Class().assign(obj, normalizable);
    };
  }
  // 添加 createArray() 静态方法
  if (!Object.hasOwn(Class, 'createArray')) {
    Class.createArray = function createArray(array, normalizable = true) {
      return CreateArrayImpl.create(Class, array, normalizable);
    };
  }
  // 添加 createPage() 静态方法
  if (!Object.hasOwn(Class, 'createPage')) {
    Class.createPage = function createPage(page) {
      if (page === undefined || page === null) {
        return null;
      } else if (Page.isValid(page)) {
        return new Page(
          page.total_count,
          page.total_pages,
          page.page_index,
          page.page_size,
          CreateArrayImpl.create(Class, page.content, true),
        );
      } else {
        throw new TypeError(`Invalid page format: ${JSON.stringify(page)}`);
      }
    };
  }
  // 添加 nullOrEmpty() 静态方法
  if (!Object.hasOwn(Class, 'nullOrEmpty')) {
    Class.nullOrEmpty = function nullOrEmpty(obj) {
      if (obj === undefined || obj === null) {
        return true;
      }
      if (!(obj instanceof Class)) {
        throw new TypeError(`The object must be an instance of the class ${Class.name}.`);
      }
      return obj.isEmpty();
    };
  }
  // console.log('@Model: Class = ', Class,
  //   ', Class.prototype = ', Class.prototype);
}

export default Model;
