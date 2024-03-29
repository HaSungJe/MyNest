import * as util from '../util/util';

// PostgreSQL 테스트
export async function postgre() {
    let sql = `
                select
                    *
                from
                    t_graphql
    `;


    return {
        success: true,
        // result: result
    }
}