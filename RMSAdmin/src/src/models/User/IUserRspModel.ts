import { IAssetRspModel } from 'models';
import { IIndustryRspModel } from './IIndustryRspModel'
import { IProvinceRspModel } from './IProvinceRspModel'
import { ICityRspModel } from './ICityRspModel'
import { IBusinessTypeRspModel } from './IBusinessTypeRspModel'

export interface IUserRspModel {
  id: string,
  name: string,
  phoneNumber: number,
  email: string,
  company: string,
  jobTitle: string,
  college: string,
  status: boolean,
  industry?: IIndustryRspModel,
  industryText: string,
  profileImage?: IAssetRspModel,
  province?: IProvinceRspModel,
  city?: ICityRspModel,
  businessType?: IBusinessTypeRspModel,
  isMemberGroupLeader: boolean,
  createdDate?: Date,
  createdBy?: IUserRspModel,
}