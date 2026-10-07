import type { Locator } from '@playwright/test';

/** A reusable block of a page. Every locator of a component is searched inside its root element. */
export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}
}
