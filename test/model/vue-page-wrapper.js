////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { defineComponent } from 'vue';
import Credential from './credential';

const PageWrapper = defineComponent({
  data() {
    return {
      page: {
        total_count: 2,
        total_pages: 1,
        page_index: 0,
        page_size: 5,
        content: [
          new Credential('IDENTITY_CARD', '12345678'),
          new Credential('PASSPORT', 'abcdefgh'),
        ],
      },
    };
  },
  template: '<div>length = {{page.content.length}}</div>',
});

export default PageWrapper;
