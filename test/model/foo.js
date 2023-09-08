/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Log } from '@/index';

export default class Foo {
  @Log
  say(message) {
    console.log(`Foo.say: ${message}`);
  }

  @Log
  add(x, y) {
    this.say(`Foo.add: ${x}, ${y}`);    // call with this
    return x + y;
  }
}
