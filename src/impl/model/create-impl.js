////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { requirePrototypeMethod } from '../utils';

/**
 * Creates an instance of a model class.
 *
 * @param {function} Class
 *     The constructor of a model class.
 * @param {object} obj
 *     The data object, usually obtained from a JSON object.
 * @param {boolean} normalized
 *     Indicates whether to normalize the created model.
 * @returns {Class | null}
 *     If the `obj` is `undefined` or `null`, returns `null`; otherwise, returns
 *     a new instance of the model class whose fields are initialized with the
 *     data in the `obj`.
 * @author Haixing Hu
 * @private
 */
function createImpl(Class, obj, normalized) {
  console.log('CreateImpl:', Class.name, obj);
  console.dir(obj, { depth: null });
  requirePrototypeMethod(Class, 'assign');
  if (obj === undefined || obj === null) {
    return null;
  } else if (typeof obj !== 'object') {
    throw new TypeError(`The first argument of ${Class.name}.create() must be an object.`);
  } else {
    return new Class().assign(obj, normalized);
  }
}

export default createImpl;
