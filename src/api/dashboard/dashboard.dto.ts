import { IsOptional, MaxLength } from "class-validator";

/**
 * 인사
 */
export class GetDataDTO {
    @IsOptional()
    @MaxLength(10, {message: '너무 길어요'})
    add_text: string;

    constructor(data: any) {
        if (data) {
            this.add_text = data['add_text'] ? data['add_text'] : null;
        }
    }
}