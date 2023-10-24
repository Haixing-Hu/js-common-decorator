////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Vue from 'vue';
import Credential from './credential';
import ObjWithArrayField from './obj-with-array-field';

const ArrayWrapper = Vue.extend({
  data() {
    return {
      array: [
        new Credential('IDENTITY_CARD', '12345678'),
        new Credential('PASSPORT', 'abcdefgh'),
      ],
      obj: new ObjWithArrayField(),
    };
  },
  template: '<div>length = {{array.length}}</div>',
});

export default ArrayWrapper;
