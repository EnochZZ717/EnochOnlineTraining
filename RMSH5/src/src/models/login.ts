import { BaseModel } from './common/base-model';
import { UserModel } from './personal-center';

export interface TokenModel extends BaseModel{
    code: number;
    message: string;
    token: string;
    isVip: boolean;
    user: UserModel;
}

export interface UserRegisterModel{
    name: string;
    phoneNumber: string;
    email: string;
    jobTitle: string;
    company: string;
    seriesNumbers?: string;
    industryID: string;
    provinceId: string;
    cityId: string;
    districtId: string;
    isVip: boolean;
    researchGroup?: string;
    researchInterests?: string;
    sampleTypeId?: string;
    experimentalRequirement?: string;
    profileImageId?: string;
    businessTypeID?: string;
    weChatImagePath?: string;
    technicalOffice?: string;
    department?: string;
    isMailReceiver?: string;
    industryText?: string;
    college?: string;
}

export interface GuideVideoModel{
    name: string;
    description: string;
    contentPath: string;
}