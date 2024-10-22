////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getSourceField from './get-source-field';
import DefaultOptions from '../../default-options';

/**
 * Tests whether the specified object is a valid page object.
 *
 * @param {any} page
 *     The object to be tested.
 * @param {object} options
 *     The options of the assignment.
 * @return {boolean}
 *     `true` if the specified object is a valid page source object; `false` otherwise.
 */
function isValidPageSource(page, options) {
  const opt = DefaultOptions.merge('assign', options);
  return (page !== undefined)
    && (page !== null)
    && (typeof page === 'object')
    && (typeof page[getSourceField('totalCount', opt)] === 'number')
    && (typeof page[getSourceField('totalPages', opt)] === 'number')
    && (typeof page[getSourceField('pageIndex', opt)] === 'number')
    && (typeof page[getSourceField('pageSize', opt)] === 'number')
    && Array.isArray(page[getSourceField('content', opt)]);
}

export default isValidPageSource;
