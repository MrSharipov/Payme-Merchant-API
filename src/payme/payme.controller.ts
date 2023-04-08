import {
  RpcId,
  RpcPayload,
  RpcVersion,
  RpcMethod,
  RpcHandler,
  RpcMethodHandler,
} from '@jashkasoft/nestjs-json-rpc';
import { PaymeService } from './payme.service';
import { Global, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';

@RpcHandler({
  method: '',
})
@Global()
@UseGuards(AuthGuard)
export class PaymeController {
  constructor(private readonly paymeService: PaymeService) {}

  @RpcMethodHandler('CheckPerformTransaction')
  public async CheckPerformTransaction(
    @RpcPayload() payload,
    // @RpcVersion() version: string,
    // @RpcId() id: number | string,
    // @RpcMethod() method: string,
  ) {
    return this.paymeService.checkPerformTransaction(payload);
  }

  @RpcMethodHandler('CreateTransaction')
  public async CreateTransaction(
    @RpcPayload() payload,
    // @RpcVersion() version: string,
    // @RpcId() id: number | string,
    // @RpcMethod() method: string,
  ) {
    return this.paymeService.createTransaction(payload);
  }

  @RpcMethodHandler('PerformTransaction')
  public async PerformTransaction(
    @RpcPayload() payload,
    // @RpcVersion() version: string,
    // @RpcId() id: number | string,
    // @RpcMethod() method: string,
  ) {
    return this.paymeService.performTransaction(payload);
  }

  @RpcMethodHandler('CancelTransaction')
  public async CancelTransaction(
    @RpcPayload() payload,
    // @RpcVersion() version: string,
    // @RpcId() id: number | string,
    // @RpcMethod() method: string,
  ) {
    return this.paymeService.cancelTransaction(payload);
  }

  @RpcMethodHandler('CheckTransaction')
  public async CheckTransaction(
    @RpcPayload() payload,
    // @RpcVersion() version: string,
    // @RpcId() id: number | string,
    // @RpcMethod() method: string,
  ) {
    return this.paymeService.checkTransaction(payload);
  }
}
