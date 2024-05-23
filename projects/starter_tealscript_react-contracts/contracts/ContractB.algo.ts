import { Contract } from '@algorandfoundation/tealscript';
import { ContractA } from './ContractA.algo';

export class ContractB extends Contract {
  parent_app_id = GlobalStateKey<uint64>();

  createApplication(parent_id: uint64): void {
    this.parent_app_id.value = parent_id;
  }

  setdata(d: string): void {
    sendMethodCall<typeof ContractA.prototype.setdata>({
      applicationID: AppID.fromUint64(this.parent_app_id.value),
      applicationArgs: [d],
      fee: 1000,
    });
  }

  getdata(): string {
    return sendMethodCall<typeof ContractA.prototype.getdata>({
      applicationID: AppID.fromUint64(this.parent_app_id.value),
      fee: 1000,
    });
  }
}
