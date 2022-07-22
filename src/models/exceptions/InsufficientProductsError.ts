export class InsufficientProducts extends Error {
  constructor(amount: number) {
    const defaultMessage = `Amount to remove ${amount} exceeds product amount`;
    super(defaultMessage);
  }
}
