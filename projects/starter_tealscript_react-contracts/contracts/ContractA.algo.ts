import { Contract } from '@algorandfoundation/tealscript';

export class ContractA extends Contract {
  data = GlobalStateKey<string>();

  createApplication(): void {
    this.data.value = '';
  }

  setdata(d: string): void {
    this.data.value = d;
  }

  getdata(): string {
    return this.data.value;
  }
}
