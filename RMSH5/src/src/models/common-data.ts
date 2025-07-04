import { BaseModel } from './common/base-model';

export interface CommonBaseModel extends BaseModel{
    name: string
}

export interface ProvinceModel extends CommonBaseModel{
    cities: CityModel[]
}

export interface CityModel extends CommonBaseModel{
    districts: CommonBaseModel[]
}

export interface LocationModel{
    value: string;
    label: string;
    children?: LocationModel[]
}