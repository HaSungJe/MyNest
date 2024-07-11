import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CheckEmailDTO, CheckNickDTO, UserAlarmDTO, UserLoginDTO, UserPatchBirthDTO, UserPatchNickDTO, UserPatchPWDTO, UserProfileDTO, UserPutDTO } from "./user.dto";
import { LoginHistory } from "@root/entities/user/t_login_history.entity";
import { User } from "@root/entities/user/t_user.entity";
import { UserFollow } from "@root/entities/user/t_user_follow.entity";
import { Profile } from "@root/entities/user/t_profile.entity";
import * as util from '@util/util';
import * as errorFilter from '@util/errorFilter';
import * as moment from 'moment';

@Injectable()
export class UserSQL {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    /**
     * 로그인 Access 토큰 재발급
     * 
     * @param ip
     * @param token 
     * @returns 
     */
    async refresh(ip: string, token: string): Promise<object> {
        // 1. 정보 확인 (Refresh Token, IP)
        let builder = this.dataSource.createQueryBuilder();
        builder.select(`
              l.user_seq
            , l.login_seq
            , l.refresh_token
            , l.access_token
        `);
        builder.from('t_login_history', 'l');
        builder.where(`l.use_yn = 'Y' and l.refresh_token = :token`, {token});
        builder.andWhere('now() < l.refresh_token_end_dt');
        // builder.andWhere('l.ip = :ip', {ip});
        const login = await builder.getRawOne();
        if (!login) {
            return { statusCode: 400, message: '올바르지 않은 정보입니다.' }
        } 

        // 2. 회원정보 검색
        builder = this.dataSource.createQueryBuilder();
        builder.select(`
              u.user_seq
            , u.auth_code
            , auth.auth_name
            , u.provider_code
            , provider.provider_name
            , state.state_name
            , u.user_email
            , u.user_name
            , u.user_nickname
        `);
        builder.from('t_user', 'u');
        builder.leftJoin('t_auth', 'auth', 'u.auth_code = auth.auth_code');
        builder.leftJoin('t_provider', 'provider', 'u.provider_code = provider.provider_code');
        builder.leftJoin('t_state', 'state', 'u.state_code = state.state_code');
        builder.andWhere('u.user_seq = :user_seq', {user_seq: login.user_seq});
        const user = await builder.getRawOne();

        // 3. Access Token 생성
        const accessTokenData = {
            type: 'access',
            provider_code: user.provider_code,
            provider_name: user.provider_name,
            user_email: user.user_email,
            user_name: user.user_name,
            user_nickname: user.user_nickname,
            auth_code: user.auth_code,
            auth_name: user.auth_name
        }
        const accessToken = util.createJWTToken(JSON.stringify(accessTokenData), 20, 'm');
        const accessTokenDecode = util.viewJWTToken(accessToken, process.env.JWT_CODE);

        // 4. 로그인 이력 수정
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            await conn.manager.update(LoginHistory, login.login_seq, {
                access_token: accessToken,
                access_token_start_dt: accessTokenDecode['iat_DATE'],
                access_token_end_dt: accessTokenDecode['exp_DATE']
            });

            await conn.commitTransaction();
            return { statusCode: 200, access_token: accessToken }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 로그아웃
     * 
     * @param token 
     * @returns 
     */
    async logout(token: string): Promise<object> {
        // 1. Access Token으로 로그인 이력 찾기
        const builder = this.dataSource.createQueryBuilder();
        builder.select(`l.login_seq as login_seq`);
        builder.from('t_login_history', 'l');
        builder.where(`l.use_yn = 'Y'`);
        builder.andWhere('l.access_token = :token', {token});
        const login = await builder.getRawOne();
        if (!login) {
            return { statusCode: 400, message: '올바르지 않은 정보입니다.' }
        }

        // 2. 로그아웃 처리
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            await conn.manager.update(LoginHistory, login.login_seq, { use_yn: 'N' })
            await conn.commitTransaction();
            return { statusCode: 200 }
        } catch (error) {
            await conn.rollbackTransaction();
            console.log(error)
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 일반 로그인
     * @param dto 
     * @returns 
     */
    async login(dto: UserLoginDTO): Promise<object> {
        // 1. 회원정보 조회 및 로그인 가능 유효성검사
        const builder = this.dataSource.createQueryBuilder();
        builder.select(`
              u.user_seq
            , u.auth_code
            , auth.auth_name
            , u.provider_code
            , provider.provider_name
            , state.state_name
            , state.state_content
            , state.login_able_yn
            , u.user_email
            , u.user_pw
            , u.user_name
            , u.user_nickname
        `);
        builder.from('t_user', 'u');
        builder.leftJoin('t_auth', 'auth', 'u.auth_code = auth.auth_code');
        builder.leftJoin('t_provider', 'provider', 'u.provider_code = provider.provider_code');
        builder.leftJoin('t_state', 'state', 'u.state_code = state.state_code');
        builder.where('u.user_email = :user_email', {user_email: dto.user_email});
        const user = await builder.getRawOne();
        if (!user) {
            return { statusCode: 400, message: '이메일이 올바르지 않습니다.' }
        } else if (!await util.matchBcrypt(dto.user_pw, user['user_pw'])) {
            return { statusCode: 400, message: '비밀번호가 올바르지 않습니다.' }
        } else if (user['login_able_yn'] === 'N') {
            return { statusCode: 400, message: `로그인이 불가능한 상태입니다. (사유: ${user['state_content']})` }
        }

        // 2. 로그인 처리
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            delete user['user_pw'];
            user.device_type = dto.device_type;
            user.device_token = dto.device_token;

            // Refresh 토큰
            const refreshTokenData = {
                type: 'refresh',
                now: moment().format('YYYYMMDDHHmmssSSS')
            }
            const refreshToken = util.createJWTToken(JSON.stringify(refreshTokenData), dto.day, 'd');
            const refreshTokenDecode = util.viewJWTToken(refreshToken, process.env.JWT_CODE);

            // Access 토큰
            const accessTokenData = {
                type: 'access',
                provider_code: user.provider_code,
                provider_name: user.provider_name,
                user_email: user.user_email,
                user_name: user.user_name,
                user_nickname: user.user_nickname,
                auth_code: user.auth_code,
                auth_name: user.auth_name
            }
            const accessToken = util.createJWTToken(JSON.stringify(accessTokenData), 20, 'm');
            const accessTokenDecode = util.viewJWTToken(accessToken, process.env.JWT_CODE);

            let loginHistory = new LoginHistory();
            loginHistory.user_seq = user.user_seq;
            loginHistory.ip = dto.ip;
            loginHistory.refresh_token = refreshToken;
            loginHistory.access_token = accessToken;
            loginHistory.device_type = dto.device_type;
            loginHistory.device_token = dto.device_token;
            loginHistory.refresh_token_start_dt = refreshTokenDecode['iat_DATE'];
            loginHistory.refresh_token_end_dt = refreshTokenDecode['exp_DATE']; 
            loginHistory.access_token_start_dt = accessTokenDecode['iat_DATE'];
            loginHistory.access_token_end_dt = accessTokenDecode['exp_DATE']; 
            await conn.manager.insert(LoginHistory, loginHistory);

            await conn.commitTransaction();
            return { statusCode: 200, refresh_token: refreshToken, access_token: accessToken }
        } catch (error) {
            console.log(error)
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 일반 회원가입
     * 
     * @param dto 
     * @returns 
     */
    async sign(dto: UserPutDTO): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 회원가입
            const user = new User();
            user.auth_code = dto.auth_code;
            user.provider_code = dto.provider_code;    
            user.region_code = dto.region_code;
            user.state_code = dto.state_code;
            user.user_email = dto.user_email;
            user.user_pw = await util.changeBcrypt(dto.user_pw);
            user.user_name = dto.user_name;
            user.user_nickname = dto.user_nickname;
            user.user_birth = dto.user_birth;
            user.user_mobile = dto.user_mobile;
            user.user_gender = dto.user_gender;
            user.user_zip = dto.user_zip;
            user.user_addr1 = dto.user_addr1;
            user.user_addr2 = dto.user_addr2;
            user.ci = dto.ci;
            const result = await conn.manager.insert(User, user);
            const user_seq = result['identifiers'][0]['user_seq'];

            // 2. 프로필정보 추가
            const profile = new Profile();
            profile.user_seq = user_seq;
            await conn.manager.insert(Profile, profile);

            await conn.commitTransaction();
            return { statusCode: 200 }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 회원 정보
     * 
     * @param user_email 
     * @returns 
     */
    async info(user_email: string): Promise<object> {
        const builder = this.dataSource.createQueryBuilder();
        builder.select(`
              u.user_seq
            , u.auth_code
            , auth.auth_name
            , u.provider_code
            , provider.provider_name
            , provider.provider_ename
            , u.region_code
            , u.state_code
            , state.state_name
            , state.state_content
            , state.login_able_yn
            , u.user_email
            , u.user_name
            , u.user_nickname
            , u.user_birth
            , u.user_mobile
            , u.user_gender
            , u.user_zip
            , u.user_addr1
            , u.user_addr2
        `);
        builder.from('t_user', 'u');
        builder.leftJoin('t_auth', 'auth', 'u.auth_code = auth.auth_code');
        builder.leftJoin('t_provider', 'provider', 'u.provider_code = provider.provider_code');
        builder.leftJoin('t_state', 'state', 'u.state_code = state.state_code');
        builder.where(`u.user_email = :user_email`, {user_email});
        return await builder.getRawOne();
    }

    /**
     * 회원 정보
     * - 프로필
     * 
     * @param user_seq 
     * @returns 
     */
    async userProfile(user_seq: number): Promise<object> {
        const builder = this.dataSource.createQueryBuilder();
        builder.select(`
              f.file_path as profile_image
            , p.like_alarm_yn
            , p.comment_alarm_yn
            , p.event_alarm_yn
        `);
        builder.from('t_profile', 'p');
        builder.leftJoin('t_file', 'f', `p.file_seq = f.file_seq and f.use_yn = 'Y'`);
        builder.where('p.user_seq = :user_seq', {user_seq});
        return await builder.getRawOne();
    }

    /**
     * 나를 팔로우한 회원 목록
     * 
     * @param user_seq 
     * @returns 
     */
    async getUserFollowMe(user_seq: number): Promise<object> {
        const builder = this.dataSource.createQueryBuilder();
        builder.select(`
              f.user_seq
            , u.user_nickname 
        `);
        builder.from('t_user_follow', 'f');
        builder.innerJoin('t_user', 'u', `f.user_seq = u.user_seq and u.use_yn = 'Y'`);
        builder.where(`f.use_yn = 'Y'`);
        builder.andWhere('f.target_user_seq = :user_seq', {user_seq});
        builder.orderBy('u.user_nickname', 'ASC');
        return await builder.getRawMany();
    }
    
    /**
     * 내가 팔로우한 회원 목록
     * 
     * @param user_seq 
     * @returns 
     */
    async getUserFollowMy(user_seq: number): Promise<object> {
        const builder = this.dataSource.createQueryBuilder();
        builder.select(`
              f.target_user_seq as user_seq
            , u.user_nickname
        `);
        builder.from('t_user_follow', 'f');
        builder.innerJoin('t_user', 'u', `f.target_user_seq = u.user_seq and u.use_yn = 'Y'`);
        builder.where(`f.use_yn = 'Y'`);
        builder.andWhere('f.user_seq = :user_seq', {user_seq});
        builder.orderBy('u.user_nickname', 'ASC');
        return await builder.getRawMany();
    }
    
    /**
     * 회원 팔로우 지정/해제
     * 
     * @param user_seq 
     * @param target_user_seq 
     * @returns 
     */
    async switchUserFollow(user_seq: number, target_user_seq: number): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 팔로우 정보 확인
            const builder = this.dataSource.createQueryBuilder();
            builder.select(`
                  f.user_follow_seq
                , f.use_yn    
            `);
            builder.from('t_user_follow', 'f');
            builder.where('f.user_seq = :user_seq', {user_seq});
            builder.andWhere('f.target_user_seq = :target_user_seq', {target_user_seq});
            const follow = await builder.getRawOne();
            if (follow) {
                // 2-1. 수정
                const use_yn = follow.use_yn === 'Y' ? 'N' : 'Y';
                await conn.manager.update(UserFollow, {user_seq, target_user_seq}, {use_yn});

                await conn.commitTransaction();
                return { statusCode: 200, follow_yn: use_yn }
            } else {
                // 2-2. 등록
                const use_yn = 'Y';
                await conn.manager.insert(UserFollow, {user_seq, target_user_seq});

                await conn.commitTransaction();
                return { statusCode: 200, follow_yn: use_yn }
            }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 회원 프로필 사진 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserProfile(dto: UserProfileDTO): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 회원정보
            const user = await this.info(dto.user_info.user_email);

            // 2. 파일정보
            const builder = this.dataSource.createQueryBuilder();
            builder.select(`f.mime_type as mime_type`);
            builder.from('t_file', 'f');
            builder.where(`f.use_yn = 'Y' and f.file_seq = :file_seq`, {file_seq: dto.file_seq});
            const file = await builder.getRawOne();
            if (!dto.file_seq || file) {
                if (!dto.file_seq || file['mime_type'].indexOf('image') !== -1) {
                    // 3. 프로필 사진 변경
                    const profile = new Profile();
                    profile.file_seq = dto.file_seq;
                    await conn.manager.update(Profile, {user_seq: user['user_seq']}, profile);
        
                    await conn.commitTransaction();
                    return { statusCode: 200 }
                } else {
                    return { statusCode: 400, message: '이미지 파일이 아닙니다.' }
                }
            } else {
                return { statusCode: 400, message: '파일정보가 올바르지 않습니다.' }
            }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 회원 알림 수신정보 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserAlarm(dto: UserAlarmDTO): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 회원정보
            const user = await this.info(dto.user_info.user_email);

            // 2. 알림 수신정보 변경
            const profile = new Profile();
            profile.like_alarm_yn = dto.like_alarm_yn;
            profile.comment_alarm_yn = dto.comment_alarm_yn;
            profile.event_alarm_yn = dto.event_alarm_yn;
            await conn.manager.update(Profile, {user_seq: user['user_seq']}, profile);

            await conn.commitTransaction();
            return { statusCode: 200 }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 이메일 중복확인
     * 
     * @param dto 
     * @returns 
     */
    async checkEmail(dto: CheckEmailDTO): Promise<object> {
        const entity = this.dataSource.createEntityManager();
        const result = await entity.findOne(User, { where: { user_email: dto.user_email } });
        if (result) {
            return { statusCode: 400, message: '이미 사용중인 이메일입니다.' }
        } else {
            return { statusCode: 200 }
        }
    }

    /**
     * 이메일 중복확인
     * 
     * @param dto 
     * @returns 
     */
    async checkNick(dto: CheckNickDTO): Promise<object> {
        const entity = this.dataSource.createEntityManager();
        const result = await entity.findOne(User, { where: { user_nickname: dto.user_nickname } });
        if (result) {
            return { statusCode: 400, message: '이미 사용중인 닉네임입니다.' }
        } else {
            return { statusCode: 200 }
        }
    }

    /**
     * 회원 닉네임 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserNick(dto: UserPatchNickDTO): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 회원정보
            const user = await this.info(dto.user_info.user_email);

            // 2. 수정
            await conn.manager.update(User, user['user_seq'], { user_nickname: dto.user_nickname });

            await conn.commitTransaction();
            return { statusCode: 200 }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 회원 생년월일 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserBirth(dto: UserPatchBirthDTO): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 회원정보
            const user = await this.info(dto.user_info.user_email);

            // 2. 수정
            await conn.manager.update(User, user['user_seq'], { user_birth: dto.user_birth });

            await conn.commitTransaction();
            return { statusCode: 200 }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }

    /**
     * 회원 비밀번호 변경
     * 
     * @param dto 
     * @returns 
     */
    async patchUserPW(dto: UserPatchPWDTO): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            // 1. 회원정보
            const user = await this.info(dto.user_info.user_email);

            // 2. 수정
            await conn.manager.update(User, user['user_seq'], { user_pw: await util.changeBcrypt(dto.user_pw) });

            await conn.commitTransaction();
            return { statusCode: 200 }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }
}