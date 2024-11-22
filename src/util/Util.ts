
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as sharp from 'sharp';
import nodemailer from 'nodemailer';
import { utils, write, read } from 'xlsx-js-style';

/**
 * Class-Validation Reject Error
 * - 유효성검사 리젝에 대한 정보
 * 
 * @param err 
 * @returns 
 */
export async function validationError(err: any) {
    let errors = [];
    for (let i=0; i<err.length; i++) {
        let error = err[i];
        let key = (Object.keys(err[i]['constraints']))[0];

        if (key === 'isBoolean') {
            if (error['contexts']) {
                errors.push({
                    type: key,
                    property: error['contexts'][key]['target'],
                    message: error['constraints'][key]
                });
            } else {
                errors.push({
                    type: key,
                    message: error['constraints'][key]
                });
            }
        } else {
            errors.push({
                type: key,
                property: error['property'],
                message: error['constraints'][key]
            });
        }
    }
    
    return errors;
}

/**
 * Create Custom Class-Validation Reject Error
 * - 유효성 검사 커스텀 생성
 * 
 * @param property 
 * @param message 
 * @returns 
 */
export function createCustomValidationError(property: string, message: string): object {
    return [{type: 'isBoolean', property, message}];
}

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
 * 배열 요소의 타입체크
 * 
 * @param list 
 */
export function checkArrayElementType(list: any, type: string) {
    let result = true;
    for (let i=0; i<list.length; i++) {
        if (type !== typeof list[i]) {
            result = false;
        }
    }

    return result;
}

/**
 * 문자열을 특정 길이까지 만들기
 * - str은 1자리 글자여야한다.
 * - 앞에 추가
 * 
 * @param v 
 * @param str 
 * @param length 
 */
export function headFillString(v: string, str: string, length: number): string {
    if (v.length < length) {
        let list = [v];
        for (let i=0; i<length-v.length; i++) {
            list = [str, ...list];
        }

        return list.join('');
    } else {
        return v;
    }
}

/**
 * 문자열을 특정 길이까지 만들기
 * - str은 1자리 글자여야한다.
 * - 뒤에 추가
 * 
 * @param v 
 * @param str 
 * @param length 
 * @returns 
 */
export function tailFillString(v: string, str: string, length: number): string {
    if (v.length < length) {
        let list = [v];
        for (let i=0; i<length-v.length; i++) {
            list = [...list, str];
        }

        return list.join('');
    } else {
        return v;
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
    if (mobile) {
        if (/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(mobile) || /^[0-9]{4}-[0-9]{4}$/.test(mobile) || /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/.test(mobile)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 이메일 유효성 체크
 * 
 * @param email 
 */
export function checkEmail(email: string): boolean {
    if (email) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 날짜 유효성 체크
 * 
 * @param {*} birth 
 * @returns 
 */
export function checkDate(birth: string, format: string): boolean {
    if (birth) {
        /**
         * 날짜 정규식[yyyy-mm-dd]       =>      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
         * 시간 정규식[hh:mm]            =>      /^(?:[01]\d|2[0-3]):[0-5]\d$/
         */
        birth = moment(birth).format(format); 
        if (birth !== 'Invalid date') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 특수문자 체크
 * 
 * @param str 
 */
export function checkSpecialChar(str: string) {
    if (str) {
        // /^[^`~!@#$%^&*|\\\'\";:\/?]+$/
        return !/[`~!@#$%^&*|\\\'\";:\/?]/gi.test(str);
    } else {
        return false;
    }
}

/**
 * 시,분 체크
 * 
 * @param v 
 * @returns 
 */
export function checkTimeFormat(v: string) {
    return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
}

/**
 * Bcrypt 암호화
 * 
 * @param {*} str 
 * @returns 
 */
export async function changeBcrypt(str: string): Promise<string> {
    return await bcrypt.hash(process.env.BCRYPT_CODE + str, 13);
}

/**
 * Bcrypt 비교
 * 
 * @param {*} strA 
 * @param {*} strB 
 */
export async function matchBcrypt(strA: string, strB: string): Promise<boolean> {
    let match1 = await bcrypt.compare(process.env.BCRYPT_CODE + strA, strB);
    let match2 = await bcrypt.compare(process.env.BCRYPT_CODE + strB, strA);
    return match1 || match2;
}

/**
 * JWT 토큰 생성
 * 
 * @param obj 
 * @param limit
 * @param limit_type
 * @returns 
 */
export function createJWTToken(obj: any, limit: number, limit_type: string) {
    return jwt.sign(JSON.parse(obj), process.env.JWT_CODE, {expiresIn: `${limit}${limit_type}`})
}

/**
 * JWT 토큰 확인
 * 
 * @param token 
 */
export function viewJWTToken(token: string, JWT_CODE: string) {
    try {
        let result = jwt.verify(token, JWT_CODE);
        result['iat_DATE'] = new Date(result['iat'] * 1000);
        result['exp_DATE'] = new Date(result['exp'] * 1000);
        result['iat_YMD'] = moment(new Date(result['iat'] * 1000)).format('YYYY-MM-DD HH:mm:ss');
        result['exp_YMD'] = moment(new Date(result['exp'] * 1000)).format('YYYY-MM-DD HH:mm:ss');
        return result;
    } catch (error) {
        return error.name;
    }
}

/**
 * 엑셀파일 생성
 * 
 * @param list 
 * @returns 
 */
export function createExcel(list: Array<object>) {
    let excel = utils.book_new();

    for (let i=0; i<list.length; i++) {
        let data = list[i];
        utils.book_append_sheet(excel, data['sheet'], data['name']);
    }

    return write(excel, {bookType: 'xlsx', type: 'base64'});
}

/**
 * 엑셀시트 생성
 * 
 * @param conf
 * @param list 
 * @returns 
 */
export function createSheet(conf: any, list: any) {
    const header_style = { 
        border: {
            bottom: {style: 'thin', color: '#000000'},
            top: {style: 'thin', color: '#000000'},
            left: {style: 'thin', color: '#000000'},
            right: {style: 'thin', color: '#000000'},
        },  
        alignment: { horizontal: "center" }, 
        fill: {fgColor: {rgb: "E9E9E9"}}, 
        font: {bold: true, sz: 15},
    }

    const row_style = { 
        font: { color: { rgb: 188038} },
        alignment: { horizontal: "center" },
        border: {
            left: {style: 'thin', color: '#000000'},
            right: {style: 'thin', color: '#000000'},
        },
        
    }

    const row_style_last = {
        font: { color: { rgb: 188038} },
        alignment: { horizontal: "center" }, 
        border: {
            left: {style: 'thin', color: '#000000'},
            right: {style: 'thin', color: '#000000'},
            bottom: {style: 'thin', color: '#000000'},
        }
    }

    let size_cols = [];
    let rows = [[]];
    let list_keys = Object.keys(list[0]);
    let keys = conf.map((e) => {
        if (list_keys.includes(e.column)) {
            return e.column;
        }
    });

    for (let i=0; i<keys.length; i++) {
        if (keys[i]) {
            // 셀 너비, 높이조절
            size_cols.push({ wpx: 200}); 
    
            rows[0].push({
                v: conf.find(e => e.column === keys[i])['memo'],
                t: 's',
                s: header_style
            });
        }
    }

    for (let i=0; i<list.length; i++) {
        let tmp_row = [];
        let row = list[i];

        let style = i < list.length-1 ? row_style : row_style_last;

        for (let i=0; i<keys.length; i++) {
            tmp_row.push({
                v: row[keys[i]],
                t: 's',
                s: style
            });
        }

        rows.push(tmp_row)
    }

    let sheet = utils.aoa_to_sheet(rows);

    // 셀 너비 조정
    sheet["!cols"] = size_cols;

    // 셀 높이 조절
    let size_rows = [{ hpx: 50}];
    for (let i=0; i<list.length; i++) {
        size_rows.push({ hpx: 25});
    }
    sheet["!rows"] = size_rows;

    return sheet;
}

/**
 * 엑셀파일 읽기
 * 
 * @param file 
 */
export function readExcel(conf: any, file: Express.Multer.File) {
    try {
        let result = [];
        let excel = read(file.buffer, {type: 'buffer'});

        for (let i=0; i<excel.SheetNames.length; i++) {
            let sheetName = excel.SheetNames[i];
            let sheet = utils.sheet_to_json(excel.Sheets[sheetName], { raw: false, dateNF: 'yyyy-mm-dd' });
            
            for (let i=0; i<sheet.length; i++) {
                let obj = {};
                for (let y=0; y<conf.length; y++) {
                    let data = sheet[i][conf[y]['memo']];
                    if (data) {
                        const type = conf[y]['type'] ? conf[y]['type'] : null;
                        obj[conf[y]['column']] = data;
                    } 
                }
    
                result.push(obj);
            }
        }

        return { statusCode: 200, result: result };
    } catch (err) {
        return { statusCode: 400, message: '파일을 읽어오는데 실패하였습니다.' }
    }
}

/**
 * 메일 송신
 * 
 * @param email 
 * @returns 
 */
export async function sendEmail(email: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 465,
        auth: {
            user: process.env.SENDER_NAVER_ID,
            pass: process.env.SENDER_NAVER_PW
        }
    });

    try {
        await transporter.sendMail({
            from: `${process.env.SENDER_NAVER_ID}@naver.com`,
            to: email,
            subject: subject,
            text: text,
        });

        return { statusCode: 200 }
    } catch (err) {
        return { statusCode: 400, message: '이메일 전송 실패' }
    } finally {
        transporter.close();
    }
}

/**
 * 파일의 메타데이터 얻기
 * 
 * @param buffer 
 */
export async function getFileMetaData(buffer: Buffer) {
    return await sharp(buffer).metadata();
}

/**
 * 이미지파일의 썸네일 생성
 * 
 * @param buffer 
 * @param width 
 * @param height 
 * @returns 
 */
export async function getFileImageThumnail(buffer: Buffer, width: number, height: number) {
    width = Math.round(width);
    height = Math.round(height);
    return await sharp(buffer).resize(width, height).toBuffer();
}