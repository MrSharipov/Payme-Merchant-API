import { RpcException } from '@jashkasoft/nestjs-json-rpc';
import { Injectable } from '@nestjs/common';
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

  async checkPerformTransaction(payload: any) {
    return {
      allow: true,
    };
  }

  async createTransaction(payload: any) {
    try {
      const transaction = await this.psTransactionsModel.findOne({
        orderId: payload.account.phone,
      });
      if (!transaction) {
        if (this.checkPerformTransaction(payload)) {
          const newTransaction = await this.createPsTransaction({
            isAllowed: true,
            transactionId: uuidv4(),
            orderId: payload.account.phone,
            externalTime: payload.time,
            create_time: Date.now(),
            amount: payload.amount,
            state: 1,
            externalId: payload.id,
          });
          return {
            state: 1,
            create_time: newTransaction.create_time,
            transaction: newTransaction.transactionId,
          };
        }
      } else {
        if (transaction.externalId !== payload.id) {
          return new RpcException('Order is not found', -31050);
        }
        if (transaction.state / 1 !== 1) {
          return new RpcException('Transaction state is incorrect', -31008);
        }

        return {
          state: 1,
          create_time: transaction.create_time,
          transaction: transaction.transactionId,
        };
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  async performTransaction(payload: any) {
    const psTransaction = await this.psTransactionsModel.findOne({
      externalId: payload.id,
    });

    if (!psTransaction) {
      return new RpcException('Transaction is not found', -31003);
    }
    if (psTransaction.state / 1 == 1) {
      const updatedTransaction =
        await this.psTransactionsModel.findOneAndUpdate(
          {
            externalId: payload.id,
          },
          { perform_time: Date.now(), state: 2 },
          { new: true },
        );
      return {
        transaction: updatedTransaction.transactionId,
        perform_time: updatedTransaction.perform_time,
        state: updatedTransaction.state,
      };
    } else if (psTransaction.state / 1 === 2) {
      return {
        transaction: psTransaction.transactionId,
        perform_time: psTransaction.perform_time,
        state: psTransaction.state,
      };
    } else {
      return new RpcException('TransactionState is incorrect', -31008);
    }
  }

  async cancelTransaction(payload: any) {
    const transaction = await this.psTransactionsModel.findOne({
      externalId: payload.id,
    });
    if (transaction.state === -2) {
      return {
        transaction: transaction.transactionId,
        cancel_time: transaction.cancel_time,
        state: transaction.state,
      };
    }
    const psTransaction = await this.psTransactionsModel.findOneAndUpdate(
      {
        externalId: payload.id,
      },
      { cancel_time: Date.now(), state: -2, reason: payload.reason },
      { new: true },
    );

    if (!psTransaction) {
      return new RpcException('Transaction is not found', -31003);
    }
    return {
      transaction: psTransaction.transactionId,
      cancel_time: psTransaction.cancel_time,
      state: psTransaction.state,
    };
  }

  async checkTransaction(payload: any) {
    const psTransaction = await this.psTransactionsModel.findOne({
      externalId: payload.id,
    });
    if (!psTransaction) {
      return new RpcException('Transaction is not found', -31003);
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

  async getStatement(payload: any) {
    return;
  }

  async createPsTransaction(data) {
    return await this.psTransactionsModel.create({
      isAllowed: data.isAllowed,
      transactionId: data.transactionId,
      orderId: data.orderId,
      amount: data.amount,
      state: 1,
      create_time: data.create_time,
      externalTime: data.externalTime,
      externalId: data.externalId,
    });
  }
}
