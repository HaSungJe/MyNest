export class PageClass {
    public readonly size: number; // 페이지당 출력될 데이터 수
    public readonly pageSize: number; // 페이지탭에 출력될 페이지의 수
    public readonly totalCount: number; // 총 게시글 수
    public readonly page: number; // 현재 페이지
    public readonly maxPage: number; // 마지막 페이지
    public readonly pageRange: any; // 페이지탭에 출력될 페이지의 시작과 끝 값
    public readonly limit: number; // Query용 limit 값
    public readonly offset: number; // Query용 offset 값

    constructor (data: any) {
        if (data) {
            this.totalCount = !isNaN(parseInt(data['totalCount'])) ? parseInt(data['totalCount']) : 1;
            this.page = !isNaN(parseInt(data['page'])) ? parseInt(data['page']) : 1;
            this.size = !isNaN(parseInt(data['size'])) ? parseInt(data['size']) : 20;
            this.pageSize = !isNaN(parseInt(data['pageSize'])) ? parseInt(data['pageSize']) : 10;

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
            this.limit = this.size;
            this.offset = ((this.page-1) * this.size);
    
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
    }

    getPageInfo() {
        return {
            totalCount: this.totalCount,
            page: this.page,
            maxPage: this.maxPage,
            pageRange: this.pageRange,
            content_start_number: this.totalCount - ((this.page - 1) * this.size),
            content_start_number_reverse: 1 + ((this.page-1) * this.size),
            description: {
                totalCount: '총 컨텐츠 수',
                page: '현재 페이지',
                maxPage: '최대 페이지',
                pageRange: '페이지탭에 표시될 페이지목록의 범위',
                content_start_number: '컨텐츠에 표시할 번호'
            }
        }
    }
}
