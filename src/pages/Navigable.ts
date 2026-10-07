/** A page that has its own address and can be opened directly. */
export interface Navigable {
  open(): Promise<void>;
}
