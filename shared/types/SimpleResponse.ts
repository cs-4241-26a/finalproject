//General Server Response
export interface SimpleResponse<T> {
    data: T;
    message: string;
    isSuccess: boolean;
}