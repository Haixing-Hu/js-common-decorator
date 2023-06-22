/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2018
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
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