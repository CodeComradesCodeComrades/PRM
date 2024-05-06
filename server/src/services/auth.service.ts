import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import cookieParser from 'cookie';
import { IncomingHttpHeaders } from 'http';
import { DateTime } from 'luxon';
import { ACCESS_COOKIE, IS_AUTHENTICATED_COOKIE } from 'src/constants';
import { UserCore } from 'src/core/user.core';
import { AuthCredentialDto, AuthDto, LoginResponseDto, LogoutResponseDto, mapLoginResponse } from 'src/dto/auth.dto';
import { CreateUserDto, UserDto, mapUser } from 'src/dto/user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { ICryptoRepository } from 'src/interfaces/crypto.interface';
import { IDatabaseRepository } from 'src/interfaces/database.interface';
import { ISessionRepository, LoginDetails } from 'src/interfaces/session.interface';
import { IUserRepository } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
    private userCore: UserCore;

    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(IDatabaseRepository) private databaseRepository: IDatabaseRepository,
        @Inject(ICryptoRepository) private cryptoRepository: ICryptoRepository,
        @Inject(ISessionRepository) private sessionRepository: ISessionRepository,
    ) {
        this.userCore = UserCore.create(userRepository, cryptoRepository);
    }

    async login(dto: AuthCredentialDto, loginDetails: LoginDetails): Promise<LoginResponse> {
        let user: UserEntity;

        if (dto.email) {
            user = await this.userRepository.getByEmail(dto.email, true);
        } else if (dto.username) {
            user = await this.userRepository.getByName(dto.username, true);
        }

        if (user) {
            if (!this.checkPassword(dto.password, user)) {
                user = null;
            }
        }

        if (!user) {
            throw new UnauthorizedException('Incorrect login details');
        }

        return this.createLoginResponse(user, loginDetails);
    }

    async logout(authDto: AuthDto): Promise<LogoutResponseDto> {
        if (authDto.userToken) {
            await this.sessionRepository.delete(authDto.userToken.userId);
        }

        return {
            loggedOut: true,
        };
    }

    private checkPassword(password: string, user: UserEntity): boolean {
        return this.cryptoRepository.compareBcrypt(password, user.password);
    }

    private async createLoginResponse(user: UserEntity, loginDetails: LoginDetails) {
        const token = this.cryptoRepository.randomSessionKey(32);
        const tokenHash = this.cryptoRepository.hashSha256(token);

        await this.sessionRepository.create({
            token: tokenHash,
            user,
        });
        const response = mapLoginResponse(user, token);
        const cookie = this.getCookies(response, loginDetails);
        return { response, cookie };
    }

    private getCookies(loginResponse: LoginResponseDto, { isSecure }: LoginDetails): string[] {
        const maxAge = 30 * 24 * 3600;

        let sessionCookie = ``;
        let isAuthenticated = ``;

        if (isSecure) {
            sessionCookie = `${ACCESS_COOKIE}=${loginResponse.accessToken}; HttpOnly; Secure; Path=/; Max-Age=${maxAge}; SameSite=Lax;`;
            isAuthenticated = `${IS_AUTHENTICATED_COOKIE}=true; Secure; Path=/; Max-Age=${maxAge}; SameSite=Lax;`;
        } else {
            sessionCookie = `${ACCESS_COOKIE}=${loginResponse.accessToken}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax;`;
            isAuthenticated = `${IS_AUTHENTICATED_COOKIE}=true; Secure; Path=/; Max-Age=${maxAge}; SameSite=Lax;`;
        }
        return [sessionCookie, isAuthenticated];
    }

    async validate(headers: IncomingHttpHeaders, params: Record<string, string>): Promise<AuthDto> {
        const sessionToken = this.getCookieToken(headers) as string;

        if (sessionToken) {
            return this.validateSessionToken(sessionToken);
        }

        throw new UnauthorizedException('Authentication required');
    }

    private async validateSessionToken(tokenValue: string): Promise<AuthDto> {
        const hashedToken = this.cryptoRepository.hashSha256(tokenValue);
        let userToken = await this.sessionRepository.getByToken(hashedToken);

        if (userToken?.user) {
            const now = DateTime.now();
            const updatedAt = DateTime.fromJSDate(userToken.updatedAt);
            const diff = now.diff(updatedAt, ['hours']);
            if (diff.hours > 1) {
                userToken = await this.sessionRepository.save({ ...userToken, updatedAt: new Date() });
            }

            return { user: userToken.user, userToken };
        }

        throw new UnauthorizedException('Invalid user token');
    }

    private getCookieToken(headers: IncomingHttpHeaders): string | null {
        const cookies = cookieParser.parse(headers.cookie || '');
        return cookies[ACCESS_COOKIE] || null;
    }

    async adminSignUp(createUserDto: CreateUserDto): Promise<UserDto> {
        const adminUser = await this.userRepository.getAdmin();
        if (adminUser) {
            throw new BadRequestException("There's already an admin account on this instance");
        }
        const admin = await this.userCore.createUser({
            ...createUserDto,
            isAdmin: true,
        });

        return mapUser(admin);
    }
}

interface LoginResponse {
    cookie: string[];
    response: LoginResponseDto;
}
