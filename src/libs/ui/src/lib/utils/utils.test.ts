import { cn } from './index';

describe('cn (className utility)', () => {
  it('should combine class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', {
      'conditional-true': true,
      'conditional-false': false,
    });
    expect(result).toBe('base conditional-true');
  });

  it('should merge tailwind classes correctly', () => {
    const result = cn('p-4 bg-blue-500', 'p-6');
    expect(result).toBe('bg-blue-500 p-6');
  });

  it('should handle array inputs', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('should merge conflicting tailwind classes correctly', () => {
    const result = cn('px-2 py-1 bg-red-500 text-white', 'px-4 bg-blue-500');
    expect(result).toBe('py-1 text-white px-4 bg-blue-500');
  });

  it('should handle complex conditional expressions', () => {
    const isActive = true;
    const isLarge = false;

    const result = cn(
      'base-class',
      isActive && 'active',
      isLarge ? 'large' : 'small'
    );
    expect(result).toBe('base-class active small');
  });
});
