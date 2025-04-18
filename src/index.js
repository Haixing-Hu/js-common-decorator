////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// The following polyfill is required to support the decorator metadata proposal.
// see:
// [1] https://github.com/babel/babel/issues/16838
// [2] https://github.com/babel/website/blob/26139b82ac19e258c806db3de4f33844bd0abda1/docs/plugin-proposal-decorators.md#note-on-symbolmetadata
import 'core-js/proposals/decorator-metadata-v2.js';
import Page from './model/page';
import Model from './model';
import Type from './type';
import ElementType from './element-type';
import Normalizable from './normalizable';
import Validatable from './validatable';
import Nullable from './nullable';
import NonEmpty from './non-empty';
import Label from './label';
import NameField from './name-field';
import Enum from './enum';
import isEnumClass from './is-enum-class';
import isEnumerator from './is-enumerator';
import DefaultOptions from './default-options';
import assign from './assign';
import create from './create';
import createArray from './create-array';
import createPage from './create-page';
import normalize from './normalize';
import toJSON from './to-json';
import toJsonString from './to-json-string';
import stringifyId from './stringify-id';
import defaultNormalizer from './default-normalizer';
import enumNormalizer from './enum-normalizer';
import Readonly from './readonly';

export {
  Page,
  Model,
  Type,
  ElementType,
  Normalizable,
  Validatable,
  Nullable,
  NonEmpty,
  Label,
  NameField,
  Enum,
  isEnumClass,
  isEnumerator,
  DefaultOptions,
  assign,
  create,
  createArray,
  createPage,
  normalize,
  toJSON,
  toJsonString,
  stringifyId,
  defaultNormalizer,
  enumNormalizer,
  Readonly,
};
