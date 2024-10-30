import { DataSource } from 'typeorm';

/**
 * 에러메시지 필터
 * - QueryError
 * - Validation
 * 
 * @param errno 
 * @param err 
 */
export async function errMessageFilter(dataSource: DataSource, err: any) {
    if (err.errno === 1062) { // 중복값
        let msg = (err.sqlMessage.substring(err.sqlMessage.indexOf('key') + 5));
        let params = (msg.substring(0, msg.length-1)).split('.');
        let memo = await getColumnMemo(dataSource, params[0], params[1]);
        return `이미 사용중인 ${memo} 입니다.`;
    } else if (err.errno === 1048) { // 공백
        let column_name = err.sqlMessage.substring(err.sqlMessage.indexOf("'") + 1, err.sqlMessage.lastIndexOf("'"));
        let memo = await getColumnMemo2(dataSource, column_name);
        return `${memo}(을)를 입력해주세요.`;
    } else if (err.errno === 1452) { // 올바르지 않은 외래키 입력
        let msg = err.sqlMessage.substring(err.sqlMessage.indexOf('constraint fails') + 18, err.sqlMessage.indexOf('CONSTRAINT') - 2).replaceAll("`", "");
        let table = msg.split('.');
        let table_name = table[1];
        let index_name = err.sqlMessage.substring(err.sqlMessage.indexOf('CONSTRAINT') + 12, err.sqlMessage.indexOf('FOREIGN KEY') - 2);
        let memo = await getColumnMemo(dataSource, table_name, index_name);
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
    let builder = dataSource.createQueryBuilder();
    builder.select(['a.column_name']);
    builder.from('information_schema.statistics', 'a');
    builder.where('a.table_name = :table_name and a.index_name = :index_name', {table_name: table_name, index_name});
    let col_name = (await builder.getRawOne())['COLUMN_NAME'];
    
    builder = dataSource.createQueryBuilder();
    builder.select(['a.column_comment as memo']);
    builder.from('INFORMATION_SCHEMA.COLUMNS', 'a');
    builder.where('a.column_name = :column_name', {column_name: col_name});
    return (await builder.getRawOne())['memo'];
}

/**
 * 테이블 메모 얻기(컬럼명으로만)
 * 
 * @param dataSource 
 * @param column_name 
 * @returns 
 */
export async function getColumnMemo2(dataSource: DataSource, column_name: string): Promise<string> {
    let builder = dataSource.createQueryBuilder();
    builder.select(['a.column_comment as memo']);
    builder.from('INFORMATION_SCHEMA.COLUMNS', 'a');
    builder.where('a.column_name = :column_name', {column_name: column_name});
    return (await builder.getRawOne())['memo'];
}
