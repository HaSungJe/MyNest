import { DataSource } from 'typeorm';

/**
 * 에러메시지 필터
 * 
 * @param dataSource 
 * @param error 
 * @returns 
 */
export async function errMessageFilter(dataSource: DataSource, error: any) {
    if (error.errno === 1062) { // 중복값
        const msg = (error.sqlMessage.substring(error.sqlMessage.indexOf('key') + 5));
        const params = (msg.substring(0, msg.length-1)).split('.');
        const memo = await getColumnMemo(dataSource, params[0], params[1]);
        return `이미 사용중인 ${memo} 입니다.`;
    } else if (error.errno === 1364) {
        const split_error_message = error.sqlMessage.split(`'`);
        const column_name = split_error_message[1];
        const memo = await getColumnMemo2(dataSource, column_name);
        return `${memo} (을)를 입력해주세요.`;
    } else if (error.errno === 1048) { // 공백
        const column_name = error.sqlMessage.substring(error.sqlMessage.indexOf("'") + 1, error.sqlMessage.lastIndexOf("'"));
        const memo = await getColumnMemo2(dataSource, column_name);
        return `${memo}(을)를 입력해주세요.`;
    } else if (error.errno === 1452) { // 올바르지 않은 외래키 입력
        const msg = error.sqlMessage.substring(error.sqlMessage.indexOf('constraint fails') + 18, error.sqlMessage.indexOf('CONSTRAINT') - 2).replaceAll("`", "");
        const table = msg.split('.');
        const table_name = table[1];
        const index_name = error.sqlMessage.substring(error.sqlMessage.indexOf('CONSTRAINT') + 12, error.sqlMessage.indexOf('FOREIGN KEY') - 2);
        const memo = await getColumnMemo(dataSource, table_name, index_name);
        return `올바르지 않은 ${memo} 입니다.`;
    } else {
        return '실패하였습니다.';
    }
}

/**
 * 테이블 메모 얻기
 * 
 * @param dataSource 
 * @param table_name 
 * @param index_name 
 * @returns 
 */
export async function getColumnMemo(dataSource: DataSource, table_name: string, index_name: string): Promise<string> {
    const builder = dataSource.createQueryBuilder();
    builder.select(['a.column_name']);
    builder.from('information_schema.statistics', 'a');
    builder.where('a.table_name = :table_name and a.index_name = :index_name', {table_name: table_name, index_name});
    const col_name = (await builder.getRawOne())['COLUMN_NAME'];
    
    const builder2 = dataSource.createQueryBuilder();
    builder2.select(['a.column_comment as memo']);
    builder2.from('INFORMATION_SCHEMA.COLUMNS', 'a');
    builder2.where('a.column_name = :column_name', {column_name: col_name});
    return (await builder2.getRawOne())['memo'];
}

/**
 * 테이블 메모 얻기(컬럼명으로만)
 * 
 * @param dataSource 
 * @param column_name 
 * @returns 
 */
export async function getColumnMemo2(dataSource: DataSource, column_name: string): Promise<string> {
    const builder = dataSource.createQueryBuilder();
    builder.select(['a.column_comment as memo']);
    builder.from('INFORMATION_SCHEMA.COLUMNS', 'a');
    builder.where('a.column_name = :column_name', {column_name: column_name});
    return (await builder.getRawOne())['memo'];
}
