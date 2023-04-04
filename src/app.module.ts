import { Module } from '@nestjs/common';
import { PaymeModule } from './payme/payme.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PsTransactionSchema } from './db/schema/psTransactions.schema';

@Module({
  imports: [
    PaymeModule,
    MongooseModule.forRoot('mongodb://localhost:27017/playstore'),
  ],
})
export class AppModule {}
