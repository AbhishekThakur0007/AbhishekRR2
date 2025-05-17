import { cn } from '../utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const condition = true;
    expect(cn('class1', condition && 'class2')).toBe('class1 class2');
  });

  it('should filter out falsy values', () => {
    expect(cn('class1', false && 'class2', null, undefined, 0, 'class3')).toBe('class1 class3');
  });

  it('should handle objects from cva/class-variance-authority', () => {
    const mockCvaOutput = {
      'base-class': true,
      'variant-class': true,
      'disabled-class': false
    };
    
    expect(cn('class1', mockCvaOutput)).toContain('base-class');
    expect(cn('class1', mockCvaOutput)).toContain('variant-class');
    expect(cn('class1', mockCvaOutput)).not.toContain('disabled-class');
  });
});