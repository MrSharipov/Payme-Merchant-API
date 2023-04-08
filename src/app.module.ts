import { Module } from '@nestjs/common';
import { PaymeModule } from './payme/payme.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PsTransactionSchema } from './db/schema/psTransactions.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PaymeModule,
    MongooseModule.forRoot('mongodb://localhost:27017/playstore'),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
