import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { RpcException } from '@jashkasoft/nestjs-json-rpc';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { headers } = request;
    if (!headers.authorization || headers.authorization.length === 0) {
      throw new RpcException('Access forbidden', -32504);
    }
    const [authType, authToken]: string[] = headers.authorization.split(' ');
    if (authType === 'Basic') {
      if (!authToken || authToken.length === 0) {
        throw new RpcException('Access forbidden', -32504);
      }
      if (
        authToken !==
        'UGF5Y29tOm9yMk9wQjdvVzNXR3ExOEdxWUc1U2daVFQyWE5mUWlRaUo1eA=='
      ) {
        throw new RpcException('Access forbidden', -32504);
      }
      const tokenFromBase64 = Buffer.from(authToken, 'base64').toString('utf8');
      const [login, key] = tokenFromBase64.split(':');
      console.log({ login, key });
      return true;
    } else if (authType === 'Bearer') {
      throw new RpcException('Access forbidden', -32504);
    }
    return true;
  }
}
