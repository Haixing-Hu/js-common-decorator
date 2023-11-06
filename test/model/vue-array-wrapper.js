////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { defineComponent } from 'vue';
import Credential from './credential';

const ArrayWrapper = defineComponent({
  data() {
    return {
      array: [
        new Credential('IDENTITY_CARD', '00000000'),
        new Credential('PASSPORT', 'xxxxxxxx'),
        new Credential('IDENTITY_CARD', '99999999'),
      ],
      obj: {},
    };
  },
  template: '<div>length = {{array.length}}</div>',
  mounted() {
    this.obj.credentials = this.array;
  }
});

export default ArrayWrapper;
