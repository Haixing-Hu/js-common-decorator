/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import defaultIfUndefinedOrNull from '@haixing_hu/common-util/src/default-if-undefined-or-null';
import trimUppercaseString from '@haixing_hu/common-util/src/trim-uppercase-string';
import { Model } from '../../src/index';

@Model
export default class Parent {
  x = 0;
  y = 0;
  z = '';

  assign(obj, normalizable) {
    console.log('Parent.assign: this = ', this, ', obj = ', obj, ', normalizable = ', normalizable);
    this.x = defaultIfUndefinedOrNull(obj.x, 0);
    this.y = defaultIfUndefinedOrNull(obj.y, 0);
    this.z = defaultIfUndefinedOrNull(obj.z, 0);
    if (normalizable === true) {
      Parent.prototype.normalize.call(this);
    }
    return this;
  }

  normalize(field) {
    console.log('Parent.normalize: field = ', field);
    if (field === undefined || field === null || field === '*') {
      this.normalize('z');
    } else if (typeof field !== 'string') {
      throw new TypeError('Field name must be a string.');
    } else {
      switch (field) {
        case 'z':
          this.z = trimUppercaseString(this.z);
          console.log('Parent.normalize: ’finished');
          break;
        default:
          break;
      }
    }
    return this;
  }
}
