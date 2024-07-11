import { Injectable } from '@nestjs/common';
import { CheckEmailDTO, CheckNickDTO, UserAlarmDTO, UserLoginDTO, UserPatchBirthDTO, UserPatchNickDTO, UserPatchPWDTO, UserProfileDTO, UserPutDTO } from './user.dto';
import { validateOrReject } from 'class-validator';
import * as util from '@util/util';
import { UserSQL } from './user.sql';

@Injectable()
export class UserService {
    constructor(
        private readonly sql: UserSQL
    ) {}

    /**
     * 로그인 Access 토큰 재발급
     * 
     * @param ip
     * @param token 
     * @returns 
     */
    async refresh(ip: string, token: string): Promise<object> {
        return await this.sql.refresh(ip, token);
    }

    /**
     * 일반 로그인
     * 
     * @param dto
     * @returns 
     */
    async login(dto: UserLoginDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.login(dto);
        } catch (error) {
            return { statusCode: 400, errors: await util.validationError(error) }
        }
    }

    /**
     * 일반 회원가입
     * 
     * @param dto 
     * @returns 
     */
    async sign(dto: UserPutDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.sign(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 로그아웃
     * 
     * @param token 
     * @returns 
     */
    async logout(token: string): Promise<object> {
        return await this.sql.logout(token);
    }

    /**
     * 회원 정보
     * 
     * @param user_email 
     * @returns 
     */
    async info(user_email: string): Promise<object> {
        // 1. 회원 정보
        const info = await this.sql.info(user_email);
        if (info) {
            // 2-1. 회원 프로필정보
            info['profile'] = await this.sql.userProfile(info['user_seq']);

            return { statusCode: 200, info }
        } else {
            return { statusCode: 400, message: '회원정보를 찾을 수 없습니다.' }
        }
    }

    /**
     * 나를 팔로우한 회원 목록
     * 
     * @param user_email 
     * @returns 
     */
    async getUserFollowMe(user_email: string): Promise<object> {
        const user = await this.sql.info(user_email);
        return await this.sql.getUserFollowMe(user['user_seq']);
    }

    /**
     * 내가 팔로우한 회원 목록
     * 
     * @param user_email 
     * @returns 
     */
    async getUserFollowMy(user_email: string): Promise<object> {
        const user = await this.sql.info(user_email);
        return await this.sql.getUserFollowMy(user['user_seq']);
    }

    /**
     * 회원 팔로우 지정/해제
     * 
     * @param user_email 
     * @param user_seq 
     * @returns 
     */
    async switchUserFollow(user_email: string, user_seq: number): Promise<object> {
        const user = await this.sql.info(user_email);
        return await this.sql.switchUserFollow(user['user_seq'], user_seq);
    }

    /**
     * 회원 프로필 사진 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserProfile(dto: UserProfileDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.patchUserProfile(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 회원 알림 수신정보 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserAlarm(dto: UserAlarmDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.patchUserAlarm(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 이메일 중복확인
     * 
     * @param dto 
     * @returns 
     */
    async checkEmail(dto: CheckEmailDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.checkEmail(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 닉네임 중복확인
     * 
     * @param dto 
     * @returns 
     */
    async checkNick(dto: CheckNickDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.checkNick(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 회원 닉네임 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserNick(dto: UserPatchNickDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.patchUserNick(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 회원 생년월일 변경
     * 
     * @param dto 
     * @returns 
     */
        async patchUserBirth(dto: UserPatchBirthDTO): Promise<object> {
            try {
                await validateOrReject(dto);
                return await this.sql.patchUserBirth(dto);
            } catch (error) {
                const errors = await util.validationError(error);
                return { statusCode: 400, message: errors[0]['message'], errors }
            }
        }

    /**
     * 회원 비밀번호 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserPW(dto: UserPatchPWDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return await this.sql.patchUserPW(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }
}
