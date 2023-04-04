import { RpcException } from '@jashkasoft/nestjs-json-rpc';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPsTransactions } from 'src/db/interface/psTransactions.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymeService {
  constructor(
    @InjectModel('Transaction')
    private psTransactionsModel: Model<IPsTransactions>,
  ) {}

  checkPerformTransaction(payload: any) {
    return {
      allow: true,
    };
  }

  async createTransaction(payload: any) {
    const psTransaction = await this.psTransactionsModel.create({
      isAllowed: true,
      transactionId: await uuidv4(),
      externalId: payload.id,
      amount: payload.amounts,
      state: 1,
    });
    if (!psTransaction) {
      throw new HttpException('Transaction is not found', 404);
    }
    return {
      create_time: psTransaction.create_time,
      transaction: await psTransaction.transactionId,
      state: 1,
    };
  }

  async performTransaction(payload: any) {
    const performTime = Date.now();
    const psTransaction = await this.psTransactionsModel.findOneAndUpdate(
      {
        externalId: payload.id,
      },
      { perform_time: performTime, state: 2 },
    );

    if (!psTransaction) {
      throw new RpcException('Transaction is not found', 404);
    }
    return {
      transaction: psTransaction.transactionId,
      perform_time: performTime,
      state: 2,
    };
  }

  async cancelTransaction(payload: any) {
    const cancelTime = Date.now();
    const psTransaction = await this.psTransactionsModel.findOneAndUpdate(
      {
        externalId: payload.id,
      },
      { cancel_time: cancelTime, state: -2, reason: payload.reason },
    );

    if (!psTransaction) {
      throw new RpcException('Transaction is not found', 404);
    }
    return {
      transaction: psTransaction.transactionId,
      cancel_time: cancelTime,
      state: -2,
    };
  }

  async checkTransaction(payload: any) {
    const psTransaction = await this.psTransactionsModel.findOne({
      externalId: payload.id,
    });
    if (!psTransaction) {
      throw new RpcException('Transaction is not found', 404);
    }

    return {
      create_time: psTransaction.create_time,
      perform_time: psTransaction.perform_time,
      cancel_time: psTransaction.cancel_time,
      transaction: psTransaction.transactionId,
      state: psTransaction.state,
      reason: psTransaction.reason,
    };
  }
}
