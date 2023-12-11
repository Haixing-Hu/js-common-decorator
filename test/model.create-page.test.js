////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { mount } from '@vue/test-utils';
import { Page } from '../src';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Person from './model/person';
import PageWrapper from './model/vue-page-wrapper';

describe('Test static method `createPage()`', () => {
  test('Test `Person.createPage(undefined)`', () => {
    const result = Person.createPage(undefined);
    expect(result).toBeNull();
  });
  test('Test `Person.createPage(null)`', () => {
    const result = Person.createPage(null);
    expect(result).toBeNull();
  });
  test('Test `Person.createPage("")`', () => {
    expect(() => Person.createPage(''))
      .toThrowWithMessage(TypeError, 'Invalid page format: ""');
  });
  test('Test `Person.createPage("xx")`', () => {
    expect(() => Person.createPage('xx'))
      .toThrowWithMessage(TypeError, 'Invalid page format: "xx"');
  });
  test('Test `Person.createPage({ xx: 123 })`', () => {
    expect(() => Person.createPage({ xx: 123 }))
      .toThrowWithMessage(TypeError, 'Invalid page format: {"xx":123}');
  });
  test('Test `Person.createPage({ page_index: 0, page_size: 10 })`', () => {
    expect(() => Person.createPage({ page_index: 0, page_size: 10 }))
      .toThrowWithMessage(TypeError, 'Invalid page format: {"page_index":0,"page_size":10}');
  });
  test('Test `Person.createPage(emptyPage)`', () => {
    const result = Person.createPage({
      total_count: 0,
      total_pages: 0,
      page_index: 0,
      page_size: 10,
      content: [],
    });
    expect(result).toEqual(new Page(0, 0, 0, 10, []));
  });
  test('Test `Person.createPage(nonEmptyPage)`', () => {
    const page = {
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
      },
      null,
      ],
    };
    const result = Person.createPage(page);
    expect(result).toBeInstanceOf(Page);
    expect(result.total_count).toBe(3);
    expect(result.total_pages).toBe(1);
    expect(result.page_index).toBe(0);
    expect(result.page_size).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(3);
    expect(result.content[0]).toBeInstanceOf(Person);
    expect(result.content[0].id).toBe(page.content[0].id);
    expect(result.content[0].name).toBe(page.content[0].name);
    expect(result.content[0].age).toBe(page.content[0].age);
    expect(result.content[0].gender).toBe('');
    expect(result.content[0].mobile).toBe(page.content[0].mobile);
    expect(result.content[0].credential).toBeInstanceOf(Credential);
    expect(result.content[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result.content[0].credential.number).toBe(page.content[0].credential.number);
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(page.content[1].name);
    expect(result.content[1].age).toBe(page.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBeNull();
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
  test('`Person.createArray()` should call `Credential.normalize()`', () => {
    const page = {
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
          type: 'passport',
          number: '1234567xx',
        },
      }, {
        name: 'Jack Ma',
        age: 55,
        credential: {
          type: '',
          number: null,
        },
      },
      null,
      ],
    };
    const result = Person.createPage(page);
    expect(result).toBeInstanceOf(Page);
    expect(result.total_count).toBe(3);
    expect(result.total_pages).toBe(1);
    expect(result.page_index).toBe(0);
    expect(result.page_size).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(3);
    expect(result.content[0]).toBeInstanceOf(Person);
    expect(result.content[0].id).toBe(page.content[0].id);
    expect(result.content[0].name).toBe(page.content[0].name);
    expect(result.content[0].age).toBe(page.content[0].age);
    expect(result.content[0].gender).toBe('');
    expect(result.content[0].mobile).toBe(page.content[0].mobile);
    expect(result.content[0].credential).toBeInstanceOf(Credential);
    expect(result.content[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result.content[0].credential.number).toBe('1234567XX');
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(page.content[1].name);
    expect(result.content[1].age).toBe(page.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBeNull();
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
  test('`Credential.createArray()` should handle the page managed by Vue', () => {
    const wrapper = mount(PageWrapper);
    expect(wrapper.vm.page).toBeDefined();
    expect(wrapper.vm.page).not.toBeNull();
    const result = Credential.createPage(wrapper.vm.page);
    expect(result.total_count).toBe(2);
    expect(result.total_pages).toBe(1);
    expect(result.page_index).toBe(0);
    expect(result.page_size).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(2);
    expect(result.content[0]).toBeInstanceOf(Credential);
    expect(result.content[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(result.content[0].number).toBe('12345678');
    expect(result.content[1]).toBeInstanceOf(Credential);
    expect(result.content[1].type).toBe(CredentialType.PASSPORT);
    expect(result.content[1].number).toBe('ABCDEFGH');
  });
});
