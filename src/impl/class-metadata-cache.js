////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

// FIXME: Why we should define this symbol here?
// see: https://github.com/babel/babel/blob/672b881e41228f5060bb80ea89f64315b4a1e05b/packages/babel-plugin-proposal-decorators/test/fixtures/metadata/element/exec.js
Symbol.metadata = Symbol.for('metadata');

/**
 * A map used to cache the metadata of each class.
 *
 * @type {Map<Function, Object>}
 * @author Haixing Hu
 * @private
 */
const METADATA_CACHE = new WeakMap();

/**
 * A cache object used to get and put metadata of classes conveniently.
 *
 * This object is useful during the implementation of customized decorators,
 * since the stage 3 decorator metadata proposal specifies that "the metadata
 * is accessible via the `Symbol.metadata` property on the class definition
 * after decoration", therefore it is not accessible via `Class[Symbol.metadata]`
 * in the implementation of a customized decorator of the `Class` (since in that
 * time the class has not been fully decorated).
 *
 * @author Haixing Hu
 * @private
 */
const classMetadataCache = {
  /**
   * Gets the metadata of a class.
   *
   * @param {Function} Class
   *     A class, i.e., the constructor function of a class.
   * @returns {Object}
   *     The metadata associated with the class. If the class has no metadata
   *     defined yet, this function will create an empty metadata and return it.
   *     Therefore, the returned value will never be `undefined` nor `null`.
   */
  get(Class) {
    const result = METADATA_CACHE.get(Class);
    if (result) {
      return result;
    } else {
      let metadata = Class[Symbol.metadata];
      if (metadata) {
        METADATA_CACHE.set(Class, metadata);
        return metadata;
      } else {
        metadata = {};
        METADATA_CACHE.set(Class, metadata);
        Class[Symbol.metadata] = metadata;
        return metadata;
      }
    }
  },

  /**
   * Sets the metadata of a class.
   *
   * @param {Function} Class
   *     A class, i.e., the constructor function of a class.
   * @param {Object} metadata
   *     The metadata associated with the class.
   */
  set(Class, metadata) {
    METADATA_CACHE.set(Class, metadata);
  },
};

export default classMetadataCache;
