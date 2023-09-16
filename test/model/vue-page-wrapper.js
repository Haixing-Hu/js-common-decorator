/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import Vue from 'vue';
import Credential from './credential';

const PageWrapper = Vue.extend({
  data() {
    return {
      page: {
        total_count: 2,
        total_pages: 1,
        page_index: 0,
        page_size: 5,
        content: [
          new Credential('IDENTITY_CARD', '12345678'),
          new Credential('passport  ', 'abcdefgh'),
        ],
      },
    };
  },
  template: '<div>length = {{page.content.length}}</div>',
});

export default PageWrapper;
