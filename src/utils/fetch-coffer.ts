import { VendingMachineInstance } from '../app';

export function fetchCoffer(objToHydrate: { [CoinType: string]: number }) {
  const coffer = VendingMachineInstance.getCoffer();

  for (const [key, value] of coffer.entries()) {
    objToHydrate[key] = value;
  }

  return objToHydrate;
}
