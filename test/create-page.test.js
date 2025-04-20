////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

import { createPage } from '../src';
import createPageImpl from '../src/impl/model/create-page-impl';

// Mock dependencies
jest.mock('../src/impl/model/create-page-impl');

describe('createPage', () => {
  beforeEach(() => {
    // Reset all mocks
    createPageImpl.mockReset();

    // Default mock implementation
    createPageImpl.mockImplementation((Class, page, options) => ({
      Class,
      page,
      options,
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    }));
  });

  test('should call createPageImpl with the provided arguments', () => {
    const TestClass = class TestClass {};
    const pageData = {
      content: [{ id: 1 }, { id: 2 }],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 10,
    };
    const options = { normalize: true };

    const result = createPage(TestClass, pageData, options);

    expect(createPageImpl).toHaveBeenCalledWith(TestClass, pageData, options);
    expect(result).toEqual({
      Class: TestClass,
      page: pageData,
      options,
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    });
  });

  test('should call createPageImpl with undefined options when not provided', () => {
    const TestClass = class TestClass {};
    const pageData = {
      content: [{ id: 1 }, { id: 2 }],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 10,
    };

    const result = createPage(TestClass, pageData);

    expect(createPageImpl).toHaveBeenCalledWith(TestClass, pageData, undefined);
    expect(result).toEqual({
      Class: TestClass,
      page: pageData,
      options: undefined,
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    });
  });

  test('should pass null page data to createPageImpl', () => {
    const TestClass = class TestClass {};
    const pageData = null;

    const result = createPage(TestClass, pageData);

    expect(createPageImpl).toHaveBeenCalledWith(TestClass, pageData, undefined);
    expect(result).toEqual({
      Class: TestClass,
      page: pageData,
      options: undefined,
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    });
  });
});
