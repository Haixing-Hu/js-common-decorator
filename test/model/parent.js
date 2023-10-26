////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@haixing_hu/common-util';
import { Model } from '../../src';

@Model
export default class Parent {
  x = 0;

  y = 0;

  z = '';

  assign(obj, normalizable) {
    console.log('Parent.assign: this = ', this, ', obj = ', obj, ', normalizable = ', normalizable);
    this.x = obj.x ?? 0;
    this.y = obj.y ?? 0;
    this.z = obj.z ?? 0;
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
