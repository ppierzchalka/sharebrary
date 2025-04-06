import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet';

// Mock portals for testing
beforeEach(() => {
  // Create a div where portals render
  document.body.innerHTML = '<div id="portal-root"></div>';
  // Mock animation duration to be shorter for tests
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    () =>
      ({ getPropertyValue: () => '0.01s' } as unknown as CSSStyleDeclaration)
  );
});

afterEach(() => {
  // Reset the DOM
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Sheet Component', () => {
  it('should not render content when closed', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument();
  });

  it('should render content when opened', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByTestId('sheet-trigger'));

    await waitFor(() => {
      expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
      expect(screen.getByText('Sheet Content')).toBeInTheDocument();
    });
  });

  it('should close when clicking the close button', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open</SheetTrigger>
        <SheetContent>
          <div>Sheet Content</div>
          <SheetClose data-testid="sheet-close">Close</SheetClose>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByTestId('sheet-trigger'));

    await waitFor(() => {
      expect(screen.getByText('Sheet Content')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('sheet-close'));

    await waitFor(() => {
      expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument();
    });
  });

  it('should render with different side positions', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open</SheetTrigger>
        <SheetContent side="right" data-testid="sheet-content">
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByTestId('sheet-trigger'));

    await waitFor(() => {
      expect(screen.getByTestId('sheet-content')).toHaveClass('right-0');
    });

    // Close and reopen with left side
    const closeButton = screen.getByTestId('x-icon').closest('button');
    if (!closeButton) {
      throw new Error('Close button not found');
    }
    // Click the close button
    await user.click(closeButton);

    rerender(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open</SheetTrigger>
        <SheetContent side="left" data-testid="sheet-content">
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByTestId('sheet-trigger'));

    await waitFor(() => {
      expect(screen.getByTestId('sheet-content')).toHaveClass('left-0');
    });
  });

  it('should render header, title, description and footer correctly', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Title</SheetTitle>
            <SheetDescription>Test Description</SheetDescription>
          </SheetHeader>
          <div>Content here</div>
          <SheetFooter>
            <button>Action Button</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByTestId('sheet-trigger'));

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Content here')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });
  });

  it('should close when clicking overlay', async () => {
    // Create a spy to track when onOpenChange is called
    const onOpenChangeSpy = vi.fn();
    const user = userEvent.setup();

    render(
      <Sheet open={true} onOpenChange={onOpenChangeSpy}>
        <SheetContent data-testid="sheet-content">
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );

    // Verify content is initially visible
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();

    // Find the overlay element - the SheetOverlay is rendered directly in the DOM
    // and has specific styling classes
    const overlay = document.querySelector('.fixed.inset-0.z-50.bg-black\\/80');
    expect(overlay).not.toBeNull();

    // Use userEvent instead of fireEvent for more realistic interaction
    if (overlay) {
      await user.click(overlay);

      // Verify onOpenChange was called with false
      expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
    }
  });
});
