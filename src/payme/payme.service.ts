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

  checkPerformTransaction(payload: any) {
    return {
      allow: true,
    };
  }

  async createTransaction(payload: any) {
    console.log(payload.id);
    const psTransaction = await this.psTransactionsModel.create({
      isAllowed: true,
      transactionId: await uuidv4(),
      externalId: payload.id,
    });
    return {
      create_time: Date.now(),
      transaction: await psTransaction.transactionId,
      state: 1,
    };
  }

  performTransaction(payload: any) {
    return { info: 'Hi perform', ...payload };
  }

  cancelTransaction(payload: any) {
    return { info: 'Hi cancel', ...payload };
  }

  checkTransaction(payload: any) {
    return { info: 'Hi check', ...payload };
  }
}
