/**
 * Bug Condition Exploration Tests — Chat Widget Triple Bug
 *
 * These tests encode the EXPECTED (correct) behavior for three bugs.
 * They are designed to FAIL on unfixed code, confirming the bugs exist.
 *
 * Bug 1: CHAT_ENDPOINT resolves to '' (backend not connected)
 * Bug 2: No backdrop / click-outside-to-close on ChatDrawer
 * Bug 3: Close button too small and invisible in default state
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import ChatDrawer from './ChatDrawer';
import { CHAT_ENDPOINT } from './types';

// ---------------------------------------------------------------------------
// Bug 1 — Endpoint Resolution
// Validates: Requirements 1.1, 1.2
// ---------------------------------------------------------------------------
describe('Bug 1 — Endpoint Resolution', () => {
  /**
   * **Validates: Requirements 1.1, 1.2**
   *
   * Property: CHAT_ENDPOINT must resolve to a non-empty HTTPS URL.
   * On unfixed code, CHAT_ENDPOINT is '' because neither
   * window.__CHAT_ENDPOINT__ nor process.env.CHAT_ENDPOINT are set.
   */
  it('CHAT_ENDPOINT resolves to a non-empty HTTPS URL', () => {
    expect(CHAT_ENDPOINT).not.toBe('');
    expect(CHAT_ENDPOINT).toMatch(/^https:\/\/.+/);
  });

  it('property: CHAT_ENDPOINT is always a valid HTTPS URL string', () => {
    fc.assert(
      fc.property(fc.constant(CHAT_ENDPOINT), (endpoint) => {
        expect(endpoint).not.toBe('');
        expect(typeof endpoint).toBe('string');
        expect(endpoint).toMatch(/^https:\/\/.+/);
      }),
      { numRuns: 1 },
    );
  });
});

// ---------------------------------------------------------------------------
// Bug 2 — Backdrop & Click-Outside
// Validates: Requirements 1.4, 1.5
// ---------------------------------------------------------------------------
describe('Bug 2 — Backdrop & Click-Outside', () => {
  /**
   * **Validates: Requirements 1.4, 1.5**
   *
   * Property: When ChatDrawer is open, a backdrop element with
   * position: fixed and semi-transparent background must exist in the DOM.
   * On unfixed code, no backdrop element exists.
   */
  it('renders a backdrop element with position:fixed when drawer is open', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ChatDrawer isOpen={true} onClose={onClose}>
        <div>content</div>
      </ChatDrawer>,
    );

    const backdrop = container.querySelector('[class*="backdrop"]');
    expect(backdrop).not.toBeNull();
    expect(backdrop).toBeInTheDocument();

    // Backdrop should have fixed positioning
    const style = window.getComputedStyle(backdrop!);
    expect(style.position).toBe('fixed');
  });

  /**
   * **Validates: Requirement 1.4**
   *
   * Property: Clicking the backdrop calls onClose.
   * On unfixed code, clicking outside does nothing.
   */
  it('clicking the backdrop calls onClose', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ChatDrawer isOpen={true} onClose={onClose}>
        <div>content</div>
      </ChatDrawer>,
    );

    const backdrop = container.querySelector('[class*="backdrop"]');
    expect(backdrop).not.toBeNull();

    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * **Validates: Requirements 1.4, 1.5**
   *
   * Property-based: For any open drawer state, a backdrop must exist
   * and clicking it must trigger onClose.
   */
  it('property: backdrop always exists and is clickable when drawer is open', () => {
    fc.assert(
      fc.property(fc.constant(true), (_isOpen) => {
        const onClose = vi.fn();
        const { container, unmount } = render(
          <ChatDrawer isOpen={true} onClose={onClose}>
            <div>content</div>
          </ChatDrawer>,
        );

        const backdrop = container.querySelector('[class*="backdrop"]');
        expect(backdrop).not.toBeNull();

        fireEvent.click(backdrop!);
        expect(onClose).toHaveBeenCalled();

        unmount();
      }),
      { numRuns: 5 },
    );
  });
});

// ---------------------------------------------------------------------------
// Bug 3 — Close Button Visibility
// Validates: Requirements 1.6, 1.7
// ---------------------------------------------------------------------------
describe('Bug 3 — Close Button Visibility', () => {
  /**
   * **Validates: Requirement 1.6**
   *
   * Property: The close button must have a minimum interactive area of
   * 32×32px. On unfixed code, the button is ~28×28px (20px SVG + 4px padding).
   */
  it('close button has interactive area >= 32x32px', () => {
    const onClose = vi.fn();
    render(
      <ChatDrawer isOpen={true} onClose={onClose}>
        <div>content</div>
      </ChatDrawer>,
    );

    const closeButton = screen.getByRole('button', { name: /close chat/i });
    expect(closeButton).toBeInTheDocument();

    // Check the CSS padding — with a 20×20 SVG, we need at least 6px padding
    // to reach 32×32 (20 + 6 + 6 = 32)
    const style = window.getComputedStyle(closeButton);
    const padding = parseInt(style.padding || '0', 10);
    const svgSize = 20;
    const totalSize = svgSize + padding * 2;

    expect(totalSize).toBeGreaterThanOrEqual(32);
  });

  /**
   * **Validates: Requirement 1.7**
   *
   * Property: The close button must have a visible background or border
   * in its default (non-hover) state. On unfixed code, the button has
   * background: none and border: none.
   */
  it('close button has visible background in default state (not background:none + border:none)', () => {
    const onClose = vi.fn();
    render(
      <ChatDrawer isOpen={true} onClose={onClose}>
        <div>content</div>
      </ChatDrawer>,
    );

    const closeButton = screen.getByRole('button', { name: /close chat/i });
    const style = window.getComputedStyle(closeButton);

    // The button should NOT have both background:none AND border:none
    // At least one visual affordance must be present
    const bgIsNone =
      style.background === 'none' ||
      style.background === '' ||
      style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
      style.backgroundColor === 'transparent' ||
      style.backgroundColor === '';
    const borderIsNone =
      style.border === 'none' ||
      style.border === '' ||
      style.borderWidth === '0px' ||
      style.borderWidth === '';

    // At least one must be visible
    const hasVisualAffordance = !bgIsNone || !borderIsNone;
    expect(hasVisualAffordance).toBe(true);
  });

  /**
   * **Validates: Requirements 1.6, 1.7**
   *
   * Property-based: For any open drawer, the close button always meets
   * minimum size and visibility requirements.
   */
  it('property: close button always meets size and visibility requirements', () => {
    fc.assert(
      fc.property(fc.constant(true), (_isOpen) => {
        const onClose = vi.fn();
        const { unmount } = render(
          <ChatDrawer isOpen={true} onClose={onClose}>
            <div>content</div>
          </ChatDrawer>,
        );

        const closeButton = screen.getByRole('button', { name: /close chat/i });
        const style = window.getComputedStyle(closeButton);

        // Size check: padding must yield >= 32px total
        const padding = parseInt(style.padding || '0', 10);
        const totalSize = 20 + padding * 2;
        expect(totalSize).toBeGreaterThanOrEqual(32);

        // Visibility check: must have visible background or border
        const bgIsNone =
          style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
          style.backgroundColor === 'transparent' ||
          style.backgroundColor === '';
        const borderIsNone =
          style.border === 'none' ||
          style.border === '' ||
          style.borderWidth === '0px' ||
          style.borderWidth === '';
        expect(!bgIsNone || !borderIsNone).toBe(true);

        unmount();
      }),
      { numRuns: 5 },
    );
  });
});
