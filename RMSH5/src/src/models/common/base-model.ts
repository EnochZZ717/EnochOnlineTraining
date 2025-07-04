export interface BaseModel{
    id: string;
    createdDate?: string;
}

export interface QueryBaseModel{
    PageNo?: number;
    PageSize?: number;
    Total?: number;
    SortField?: string;
    SortOrder?: number;
}

export interface ListBaseModel<T>{
    total: number;
    data: T[]
}