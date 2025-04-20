////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { create, Page } from '../src';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Person from './model/person';

describe('create', () => {
  test('create() with options.elementTypes', () => {
    const data = {
      total_count: 3,
      total_pages: 1,
      page_index: 0,
      page_size: 5,
      content: [{
        id: 'xxxxx',
        name: 'Bill Gates',
        age: 63,
        mobile: '139280384745',
        credential: {
          type: 'PASSPORT',
          number: '1234567',
        },
      }, {
        name: 'Jack Ma',
        age: 55,
        credential: {
          type: '',
          number: null,
        },
      }, null,
      ],
    };
    const result = create(Page, data, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
      elementTypes: {
        '.content': Person,
      },
    });
    expect(result).toBeInstanceOf(Page);
    expect(result.totalCount).toBe(3);
    expect(result.totalPages).toBe(1);
    expect(result.pageIndex).toBe(0);
    expect(result.pageSize).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(3);
    expect(result.content[0]).toBeInstanceOf(Person);
    expect(result.content[0].id).toBe(data.content[0].id);
    expect(result.content[0].name).toBe(data.content[0].name);
    expect(result.content[0].age).toBe(data.content[0].age);
    expect(result.content[0].gender).toBe('');
    expect(result.content[0].mobile).toBe(data.content[0].mobile);
    expect(result.content[0].credential).toBeInstanceOf(Credential);
    expect(result.content[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result.content[0].credential.number).toBe(data.content[0].credential.number);
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(data.content[1].name);
    expect(result.content[1].age).toBe(data.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBe(CredentialType.IDENTITY_CARD);
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
});
