import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useMobileDetection } from './sidebar.hooks';

describe('useMobileDetection', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    vi.clearAllMocks();
  });

  it('returns true when window width is less than breakpoint', () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useMobileDetection());
    expect(result.current).toBe(true);
  });

  it('returns false when window width is greater than breakpoint', () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useMobileDetection());
    expect(result.current).toBe(false);
  });

  it('uses custom breakpoint', () => {
    window.innerWidth = 900;

    const { result } = renderHook(() => useMobileDetection(1000));
    expect(result.current).toBe(true);
  });

  it('updates when window is resized', () => {
    // Start with desktop size
    window.innerWidth = 1024;

    const { result, rerender } = renderHook(() => useMobileDetection());

    // Initial value should be desktop (false)
    expect(result.current).toBe(false);

    // Simulate a window resize to mobile
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    // After resize, should be mobile (true)
    expect(result.current).toBe(true);
  });
});
