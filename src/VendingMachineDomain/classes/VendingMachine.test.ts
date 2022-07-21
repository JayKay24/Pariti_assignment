import { VendingMachine } from './VendingMachine';

describe('VendingMachine', () => {
  it('VendingMachine is a Singleton', () => {
    expect(VendingMachine.getInstance()).toBe(VendingMachine.getInstance());
  });
});
