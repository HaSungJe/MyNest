// 페이지정보
export class PageDTO {
    page: number;
    size: number;
    pageSize: number;

    constructor(data: any) {
        if (data) {
            this.page = !isNaN(parseInt(data['page'])) ? parseInt(data['page']) : 1;
            this.size = !isNaN(parseInt(data['size'])) ? parseInt(data['size']) : 20;
            this.pageSize = !isNaN(parseInt(data['pageSize'])) ? parseInt(data['pageSize']) : 10;
        }
    }

    getPageData() {
        return {
            page: this.page,
            size: this.size,
            pageSize: this.pageSize,
        }
    }
}