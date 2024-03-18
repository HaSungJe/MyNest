
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

/**
 * Null, Undefined 체크
 * 
 * @param {*} v 변수
 */
export function isNull(v: any): boolean {
    if (v !== undefined && v !== null && v !== '') {
        return true;
    } else {
        return false;
    }
}

/**
     * Null, Undefined일 경우 지정한 값으로 리턴
     * 
     * @param {*} v 변수
     * @param {*} d 변수가 isNull을 충족하지 못하는 경우 리턴되는 값
    */
export function d_null(v: any, d: any): any {
    return this.isNull(v) ? v : d;
}

/**
 * 해당 숫자가 Null, Undefined가 아니고 숫자인지 판단한 후 리턴
 * 
 * @param {*} v 변수
 */
export function isNum(v: any): boolean {
    try {
        if (this.isNull(v) && !isNaN(v)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

/**
 * 해당 숫자가 Null, Undefined 또는 숫자가 아닐경우 지정한 값으로 리턴
 * 
 * @param {*} v 변수
 * @param {*} d 변수가 isNum을 충족하지 못하는 경우 리턴되는 값
 */
export function d_num(v: any, d: any): any {
    if (this.isNum(v)) {
        return v;
    } else {
        if (this.isNum(d)) {
            return d;
        } else {
            return 0;
        }
    }
}

/**
 * 10보다 작은 수 "0" 으로 채우기
 * 
 * @param {*} v 
 */
export function addZero(v: any): string {
    if (this.isNull(v)) {
        if (parseInt(v) < 10) {
            v = "0" + v;
        } else {
            v = "" + v;
        }
    
        return v;
    } else {
        return "01";
    }
}

/**
 * 데이터 형식 얻기
 * 
 * @param {*} v 
 */
export function getDataType(v: any): string {
    if (typeof v === 'string') {
        return 'String'
    } else if (typeof v === 'object') {
        return Array.isArray(v) ? 'Array' : 'Object';
    } else if (typeof v === 'number') {
        return Number.isInteger(v) ? 'Integer' : 'Float';
    }
}

/**
 * 배열에 들어있는 데이터를 in 절에서 사용할 수 있게 변환(문자)
 * 
 * @param {*} list 
 */
export function query_array_to_string(list: []): string {
    return "'" + list.join("','") + "'";
}

/**
 * 배열에 들어있는 데이터를 in 절에서 사용할 수 있게 변환(숫자)
 * @param {*} list 
 */
export function query_array_to_integer(list: []): string {
    return list.join(",");
}

/**
 * 전화번호 유효성 체크
 * 
 * @param {*} mobile 
 */
export function checkMobile(mobile: string): boolean {
    if (/^010-[0-9]{4}-[0-9]{4}$/.test(mobile)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 생년월일 유효성 체크
 * 
 * @param {*} birth 
 * @returns 
 */
export function checkBirth(birth: string): boolean {
    birth = moment(birth).format('YYYY-MM-DD'); 
    if (birth !== 'Invalid date') {
        return true;
    } else {
        return false;
    }
}

/**
 * Bcrypt 암호화
 * 
 * @param {*} str 
 * @returns 
 */
export async function changeBcrypt(str: string): Promise<string> {
    return await bcrypt.hash(str, 8)
}

/**
 * Bcrypt 비교
 * 
 * @param {*} strA 
 * @param {*} strB 
 */
export async function matchBcrypt(strA: string, strB: string): Promise<boolean> {
    let match1 = await bcrypt.compare(strA, strB);
    let match2 = await bcrypt.compare(strB, strA);
    return match1 || match2;
}