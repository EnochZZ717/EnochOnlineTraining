import axios from 'axios';
import { GET_TOKEN, INDUSTRIES, SAMPLE_TYPES, PROVINCE, REGISTER, BUSSINESS_TYPE, GUIDE_VIDEO, GET_TOKEN_BY_PHONENUMBER } from './urls';
import { CommonBaseModel, ProvinceModel } from '../models/common-data';
import { HttpStatusCode } from '../models/common/http-status-code';
import { TokenModel, UserRegisterModel, GuideVideoModel } from '../models/login';

// 获取行业信息
export const getIndustries = async() => {
    let result : CommonBaseModel[] = await axios(INDUSTRIES).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    })
    return result;
}

// 获取样品类型
export const getSampleTypes = async() => {
    let result : CommonBaseModel[] = await axios(SAMPLE_TYPES).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    })
    return result;
}

// 获取省市区信息
export const getProvince = async() => {
    let result : ProvinceModel[] = await axios(PROVINCE).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    })
    return result;
}

// 获取token
export const getToken = async(code: string) => {
    let params = code === 'test' ? {code} : {PhoneNumber: code};
    let result : TokenModel = await axios(code === 'test' ? GET_TOKEN : GET_TOKEN_BY_PHONENUMBER, {params}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {};
    })
    return result;
}

// 用户注册
export const userRegister = async(data: UserRegisterModel) => {
    let result : boolean = await axios(REGISTER, {method: 'post', data}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }else{
            return false;
        }
    }).catch(() => {
        return false;
    })
    return result;
}

// 获取企业类型
export const getBussinessType = async() => {
    let result : CommonBaseModel[] = await axios(BUSSINESS_TYPE).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    })
    return result;
}

// 获取SN引导视频
export const getGuideVideo = async() => {
    let result : GuideVideoModel[] = await axios(GUIDE_VIDEO).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    })
    return result;
}