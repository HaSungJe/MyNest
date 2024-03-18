export class Paging {
    size: number;
    pageSize: number;
    totalCount: number;
    page: number;
    maxPage: number;
    limit: any;
    pageRange: any;
    
    constructor (data: any) {
        this.totalCount = 'number' === typeof data.totalCount ? data.totalCount : 1;
        this.page = 'number' === typeof data.page ? data.page : 1;
        this.size = 'number' === typeof data.size ? data.size : 10;
        this.pageSize = 'number' === typeof data.pageSize ? data.pageSize: 10;

        // 현재페이지가 1보다 작을경우, 1로 변경
        if (this.page <= 0) {
            this.page = 1;
        }

        // 최대 페이지 수
        this.maxPage = Math.floor(this.totalCount / this.size);
        if (this.totalCount % this.size > 0) {
            this.maxPage++; 
        }

        // 총 개수가 0일 경우, 최대페이지를 기본 1로 설정.
        if (this.maxPage === 0) {
            this.maxPage = 1;
        }

        // 현재페이지가 최대페이지를 넘어설 경우, 현재페이지를 최대페이지로 변경
        if (this.page > this.maxPage) {
            this.page = this.maxPage;
        }

        // mysql 검색용 limit 
        this.limit = {
            start: ((this.page-1) * this.size),
            end: this.size
        }

        // 노출할 페이지 목록 수
        this.pageRange = {
            start: 0,
            end: 0
        }
        this.pageRange.end = Math.floor(this.page / this.pageSize);
        if (this.page % this.pageSize > 0) {
            this.pageRange.end++;
        }
        this.pageRange.end = this.pageRange.end * this.pageSize;
        this.pageRange.start = this.pageRange.end - (this.pageSize - 1);
        if (this.pageRange.end > this.maxPage) {
            this.pageRange.end = this.maxPage;
        }
    }

    getPageInfo() {
        return {
            totalCount: this.totalCount,
            page: this.page,
            maxPage: this.maxPage,
            pageRange: this.pageRange,
            content_start_number: this.totalCount - ((this.page - 1) * this.size)
        }
    }

    getLimitInfo() {
        return this.limit;
    }
}
