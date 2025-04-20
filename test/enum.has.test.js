////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum } from '../src';

/**
 * @test Test of the `@Enum` decorator
 * @author Haixing Hu
 */
describe('Test @Enum', () => {
  describe('has function', () => {
    // 定义一个颜色枚举
    @Enum
    class Color {
      static RED = { value: 'RED', code: 'R', name: '红色' };
      static GREEN = { value: 'GREEN', code: 'G', name: '绿色' };
      static BLUE = { value: 'BLUE', code: 'B', name: '蓝色' };
    }

    it('should return true when testing with an existing enumerator', () => {
      expect(Color.has(Color.RED)).toBe(true);
      expect(Color.has(Color.GREEN)).toBe(true);
      expect(Color.has(Color.BLUE)).toBe(true);
    });

    it('should return false when testing with a non-existing enumerator', () => {
      expect(Color.has({ value: 'YELLOW', code: 'Y', name: '黄色' })).toBe(false);
    });

    it('should return true when testing with an existing value', () => {
      expect(Color.has('RED')).toBe(true);
      expect(Color.has('GREEN')).toBe(true);
      expect(Color.has('BLUE')).toBe(true);
    });

    it('should return false when testing with a non-existing value', () => {
      expect(Color.has('YELLOW')).toBe(false);
    });

    it('should handle trimming and case conversion for value', () => {
      expect(Color.has(' red ')).toBe(true);
      expect(Color.has('red')).toBe(true);
    });

    it('should return true when testing with an existing name', () => {
      expect(Color.has('红色')).toBe(true);
      expect(Color.has('绿色')).toBe(true);
      expect(Color.has('蓝色')).toBe(true);
    });

    it('should return false when testing with a non-existing name', () => {
      expect(Color.has('黄色')).toBe(false);
    });

    it('should return true when testing with an existing code', () => {
      expect(Color.has('R')).toBe(true);
      expect(Color.has('G')).toBe(true);
      expect(Color.has('B')).toBe(true);
    });

    it('should return false when testing with a non-existing code', () => {
      expect(Color.has('Y')).toBe(false);
    });
  });
}); 