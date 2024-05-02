/**
 * PRM
 * 0.0.1
 * DO NOT MODIFY - This file has been generated using oazapfts.
 * See https://www.npmjs.com/package/oazapfts
 */
import * as Oazapfts from "@oazapfts/runtime";
import * as QS from "@oazapfts/runtime/query";
export const defaults: Oazapfts.Defaults<Oazapfts.CustomHeaders> = {
    headers: {},
    baseUrl: "/api",
};
const oazapfts = Oazapfts.runtime(defaults);
export const servers = {
    server1: "/api"
};
export type $ = {};
export type CreateUserDto = {
    email: string;
    name: $;
    password: string;
};
export type AuthCredentialDto = {
    email: $;
    password: $;
    username?: string;
};
export type DiaryCreateDto = {
    content: string;
    date: string;
    rating?: number;
};
export type DiaryEditDto = {
    content: $;
    rating?: number;
};
export type ServerConfigDto = {
    isOnboarded: boolean;
};
export type UserResponseDto = {
    email: string;
    id: string;
    isAdmin: boolean;
    name: string;
};
export function createFirstAdmin({ createUserDto }: {
    createUserDto: CreateUserDto;
}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchText("/auth/admin-signup", oazapfts.json({
        ...opts,
        method: "POST",
        body: createUserDto
    })));
}
export function login({ authCredentialDto }: {
    authCredentialDto: AuthCredentialDto;
}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchText("/auth/login", oazapfts.json({
        ...opts,
        method: "POST",
        body: authCredentialDto
    })));
}
export function logout(opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchText("/auth/logout", {
        ...opts,
        method: "POST"
    }));
}
export function create({ diaryCreateDto }: {
    diaryCreateDto: DiaryCreateDto;
}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchText("/diary", oazapfts.json({
        ...opts,
        method: "POST",
        body: diaryCreateDto
    })));
}
export function deleteByDate({ date }: {
    date: string;
}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchText(`/diary/${encodeURIComponent(date)}`, {
        ...opts,
        method: "DELETE"
    }));
}
export function editDiary({ date, diaryEditDto }: {
    date: string;
    diaryEditDto: DiaryEditDto;
}, opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchText(`/diary/${encodeURIComponent(date)}`, oazapfts.json({
        ...opts,
        method: "PATCH",
        body: diaryEditDto
    })));
}
export function getServerConfig(opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchJson<{
        status: 200;
        data: ServerConfigDto;
    }>("/server-info/config", {
        ...opts
    }));
}
export function getMyUser(opts?: Oazapfts.RequestOpts) {
    return oazapfts.ok(oazapfts.fetchJson<{
        status: 200;
        data: UserResponseDto;
    }>("/user/me", {
        ...opts
    }));
}
