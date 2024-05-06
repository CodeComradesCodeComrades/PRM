import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    applyDecorators,
    createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth, ApiCookieAuth, ApiSecurity } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthDto } from 'src/dto/auth.dto';
import { LoginDetails } from 'src/interfaces/session.interface';
import { AuthService } from 'src/services/auth.service';
import { PRMLogger } from 'src/utils/logger';

export enum Metadata {
    AUTH_ROUTE = 'auth_route',
    ADMIN_ROUTE = 'admin_route',
    PUBLIC_SECURITY = 'public_security',
}

export const GetLoginDetails = createParamDecorator((data, context: ExecutionContext): LoginDetails => {
    const request = context.switchToHttp().getRequest<Request>();

    return {
        clientIp: request.ip,
        isSecure: request.secure,
    };
});

@Injectable()
export class AuthGuard implements CanActivate {
    private logger = new PRMLogger(AuthGuard.name);

    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const targets = [context.getHandler(), context.getClass()];

        const isAuthRoute = this.reflector.getAllAndOverride(Metadata.AUTH_ROUTE, targets);
        const isAdminRoute = this.reflector.getAllAndOverride(Metadata.ADMIN_ROUTE, targets);

        if (!isAuthRoute) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthRequest>();

        const authDto = await this.authService.validate(request.headers);

        if (isAdminRoute && !authDto.user.isAdmin) {
            this.logger.warn(`Denied access to admin only route: ${request.path}`);
            return false;
        }

        request.user = authDto;

        return true;
    }
}

export interface AuthRequest extends Request {
    user?: AuthDto;
}

export interface AuthOptions {
    isAdmin?: false;
}

export const Authenticated = (options: AuthOptions = {}) => {
    const decorators: MethodDecorator[] = [ApiBearerAuth(), ApiCookieAuth(), SetMetadata(Metadata.AUTH_ROUTE, true)];

    if (options.isAdmin) {
        decorators.push(AdminRoute());
    }

    return applyDecorators(...decorators);
};

export const Auth = createParamDecorator((data, context: ExecutionContext): AuthDto => {
    return context.switchToHttp().getRequest<{ user: AuthDto }>().user;
});

export const AdminRoute = (value = true) => SetMetadata(Metadata.ADMIN_ROUTE, value);

export const PublicRoute = () =>
    applyDecorators(SetMetadata(Metadata.AUTH_ROUTE, false), ApiSecurity(Metadata.PUBLIC_SECURITY));
