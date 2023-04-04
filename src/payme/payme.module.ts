import { Module } from '@nestjs/common';
import { PaymeController } from './payme.controller';
import { PaymeService } from './payme.service';
import { JsonRpcModule } from '@jashkasoft/nestjs-json-rpc';
import { MongooseModule } from '@nestjs/mongoose';
import { PsTransactionSchema } from 'src/db/schema/psTransactions.schema';

@Module({
  imports: [
    JsonRpcModule.forRoot({
      path: '/rpc', // path to RPC
    }),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: PsTransactionSchema },
    ]),
  ],

  providers: [PaymeController, PaymeService],
})
export class PaymeModule {}
