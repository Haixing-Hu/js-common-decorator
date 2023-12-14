////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../src/impl/class-metadata-cache';
import Credential from './model/validatible-credential';
import CredentialSubclass from './model/validatible-credential-subclass';
import Person from './model/validatible-person';

/**
 * Unit test the @Validatable decorator.
 *
 * @author Haixing Hu
 */
describe('Unit test the meta-information of the @Validatable', () => {
  test('Test metadata of Credential', () => {
    const metadata = classMetadataCache.get(Credential);
    expect(metadata).not.toBeNull();
    console.log('Credential.metadata = ', metadata);
  });
  test('Test metadata of CredentialSubclass', () => {
    const metadata = classMetadataCache.get(CredentialSubclass);
    expect(metadata).not.toBeNull();
    console.log('CredentialSubclass.metadata = ', metadata);
  });
  test('Test metadata of Person', () => {
    const metadata = classMetadataCache.get(Person);
    expect(metadata).not.toBeNull();
    console.log('Person.metadata = ', metadata);
  });
});
