import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, Length, Matches } from 'class-validator';
import * as util from '@root/util/util';

// 회원 엑셀등록
export class ExcelUserPutDTO {
    auth_code: string = 'USER';
    provider_code: string = 'EMAIL';

    @Length(6,30, {message: '이메일은 6-30자 이내여야합니다.'})
    @IsEmail(undefined, {message: '이메일 형식이 올바르지 않습니다.'})
    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    user_email: string;

    @IsOptional()
    @Length(2,10, {message: '이름은 2-10자 이내여야합니다.'})
    user_name: string;

    @IsOptional()
    @Length(2,10, {message: '닉네임은 2-10자 이내여야합니다.'})
    user_nickname: string;

    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    user_pw: string;

    @IsNotEmpty({message: '비밀번호를 모두 입력해주세요.'})
    user_pw2: string;

    @IsBoolean({message: '새 비밀번호가 서로 다릅니다.', context: {target: 'user_pw'} })
    check_user_pw: boolean = true;

    constructor(data: any) {
        if (data) {
            this.user_email = data['user_email'];
            this.user_name = data['user_name'];
            this.user_nickname = data['user_nickname'];
            this.user_pw = data['user_pw'];
            this.user_pw2 = data['user_pw2'];

            if (this.user_pw !== this.user_pw2) {
                this.check_user_pw = null;
            }
        }
    }
}

// 로그인
export class UserLoginDTO {
    ip: string;
    day: number;
    
    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    user_email: string;
    
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    user_pw: string;
    
    device_type: string;
    device_token: string;
    device_os: string;

    @IsBoolean({message: '디바이스 정보가 없습니다.'})
    device_token_check: boolean = true;

    constructor(data: any) {
        if (data) {
            this.ip = data['ip'];
            this.user_email = data['user_email'];
            this.user_pw = data['user_pw'];
            this.day = data['day'] > 0 && data['day'] < 366 ? data['day'] : 1;
            
            const headers = data['headers'];
            let agent = headers['user-agent'].toLowerCase();
            if (agent.indexOf('mobile') !== -1) {
                data['device_type'] = 'M';
    
                if (agent.indexOf('android') !== -1) {
                    this.device_os = 'android';
                } else if (agent.indexOf("iphone") !== -1 || agent.indexOf("ipad") !== -1 || agent.indexOf("ipod") !== -1 ) {
                    this.device_os = 'ios';
                } else {
                    this.device_os = 'other';
                }
            } else {
                this.device_type = 'W';
            }
    
            if (headers['user-agent'].includes('Mobile')) {
                this.device_type = 'M';
            } else {
                this.device_type = 'W';
            }

            this.device_token = data['device_token'] ? data['device_token'] : null;
            if (this.device_type === 'M' && !util.isNull(this.device_token)) {
                this.device_token_check = null;
            }
        }
    }
}

// 회원
export class UserDTO {
    @IsOptional()
    @IsNumberString(undefined, {message: '지역정보가 올바르지 않습니다.'})
    @Length(5,5, {message: '지역정보가 올바르지 않습니다.'})
    region_code: string;

    @Length(6,30, {message: '이메일은 6-30자 이내여야합니다.'})
    @IsEmail(undefined, {message: '이메일 형식이 올바르지 않습니다.'})
    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    user_email: string;

    @IsOptional()
    @Length(2,10, {message: '이름은 2-10자 이내여야합니다.'})
    user_name: string;

    @IsOptional()
    @Length(2,10, {message: '닉네임은 2-10자 이내여야합니다.'})
    user_nickname: string;

    @IsOptional()
    @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {message: '생년월일을 올바르게 입력해주세요.'})
    user_birth: string;

    @IsOptional()
    @Matches(/^(\d{3,4}-\d{3,4}|\d{3,4}-\d{3,4}-\d{4})$/, { message: "연락처를 올바르게 입력해주세요." })
    user_mobile: string;

    user_gender: string;
    user_zip: string;
    user_addr1: string;
    user_addr2: string;
    ci: string;

    constructor(data: any) {
        if (data) {
            this.region_code = data['region_code'];
            this.user_email = data['user_email'];
            this.user_name = data['user_name'] ? data['user_name'] : null;

            this.user_nickname = data['user_nickname'] ? data['user_nickname'] : null;
            this.user_birth = data['user_birth'] ? data['user_birth'] : null;
            this.user_mobile = data['user_mobile'] ? data['user_mobile'] : null;
            this.user_gender = ['M', 'F'].includes(data['user_gender']) ? data['user_gender'] : null

            this.user_zip = data['user_zip'];
            this.user_addr1 = data['user_addr1'];
            this.user_addr2 = data['user_addr2'];
            this.ci = data['ci'];
        }
    }
}

// 회원가입
export class UserPutDTO extends UserDTO{
    auth_code: string;
    provider_code: string;
    state_code: string = '00';

    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    user_pw: string;

    @IsNotEmpty({message: '비밀번호를 모두 입력해주세요.'})
    user_pw2: string;

    @IsBoolean({message: '새 비밀번호가 서로 다릅니다.', context: {target: 'user_pw'} })
    check_user_pw: boolean = true;

    constructor(data: any) {
        super(data);
        if (data) {
            this.auth_code = data['auth_code'];
            this.provider_code = data['provider_code'];
            this.user_pw = data['user_pw'];
            this.user_pw2 = data['user_pw2'];

            if (this.user_pw !== this.user_pw2) {
                this.check_user_pw = null;
            }
        }
    }
}

// 회원의 프로필 사진
export class UserProfileDTO {
    user_info: any;

    @IsOptional()
    @IsNumber(undefined, {message: '파일정보는 숫자여야합니다.'})
    file_seq: number;

    constructor(data: any) {
        if (data) {
            this.user_info = data['user_info'];
            this.file_seq = data['file_seq'] ? data['file_seq'] : null;
        }
    }
}

// 회원의 알림 수신정보
export class UserAlarmDTO {
    user_info: any;
    like_alarm_yn: string;
    comment_alarm_yn: string;
    event_alarm_yn: string;

    constructor(data: any) {
        if (data) {
            this.user_info = data['user_info'];
            this.like_alarm_yn = 'Y' === data['like_alarm_yn'] ? 'Y' : 'N';
            this.comment_alarm_yn = 'Y' === data['comment_alarm_yn'] ? 'Y' : 'N';
            this.event_alarm_yn = 'Y' === data['event_alarm_yn'] ? 'Y' : 'N';
        }
    }
}

// 이메일 중복여부 확인
export class CheckEmailDTO {
    @Length(6,30, {message: '이메일은 6-30자 이내여야합니다.'})
    @IsEmail(undefined, {message: '이메일 형식이 올바르지 않습니다.'})
    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    user_email: string;

    constructor(data: any) {
        if (data) {
            this.user_email = data['user_email'];
        }
    }
}

// 닉네임 중복여부 확인
export class CheckNickDTO {
    @Length(2,10, {message: '닉네임은 2-10자 이내여야합니다.'})
    @IsNotEmpty({message: '닉네임을 입력해주세요.'})
    user_nickname: string;

    constructor(data: any) {
        if (data) {
            this.user_nickname = data['user_nickname'];
        }
    }
}

// 닉네임 변경
export class UserPatchNickDTO {
    user_info: any;

    @Length(2,10, {message: '닉네임은 2-10자 이내여야합니다.'})
    @IsNotEmpty({message: '닉네임을 입력해주세요.'})
    user_nickname: string;

    constructor(data: any) {
        if (data) {
            this.user_info = data['user_info'];
            this.user_nickname = data['user_nickname'];
        }
    }
}

// 생년월일 변경
export class UserPatchBirthDTO {
    user_info: any;

    @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {message: '생년월일을 올바르게 입력해주세요.'})
    @IsNotEmpty({message: '생년월일을 입력해주세요.'})
    user_birth: string;

    constructor(data: any) {
        if (data) {
            this.user_info = data['user_info'];
            this.user_birth = data['user_birth'];
        }
    }
}

// 비밀번호 변경
export class UserPatchPWDTO {
    user_info: any;

    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    user_pw: string;

    @IsNotEmpty({message: '비밀번호를 모두 입력해주세요.'})
    user_pw2: string;

    @IsBoolean({message: '새 비밀번호가 서로 다릅니다.', context: {target: 'user_pw'} })
    check_user_pw: boolean = true;

    constructor(data: any) {
        if (data) {
            this.user_info = data['user_info'];
            this.user_pw = data['user_pw'];
            this.user_pw2 = data['user_pw2'];

            if (this.user_pw !== this.user_pw2) {
                this.check_user_pw = null;
            }
        }
    }
}