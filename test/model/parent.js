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

  normalizeField(field) {
    switch (field) {
      case 'z':
        this.z = trimUppercaseString(this.z);
        console.log('Parent.normalize: ’finished');
        return true;
      default:
        return false;
    }
  }
}
