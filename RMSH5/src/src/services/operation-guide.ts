import axios from 'axios';
import { HttpStatusCode } from '../models/common/http-status-code';
import { CATEGORY_OPERATION, COURSE_OPERATION, COURSE_EXAM, COURSE_CATEGORY_CONFIG, EXAM_RESULT, SERIES_NUMBER_EXIST, USER_SERIES_NUMBER } from './urls';
import { OperationGuideCategoryModel, OperationGuideCourseModel, OperationGuideQueryModel, CourseExamModel, ExamRequestModel, ExamResponseModel, UserSNResponseModel } from '../models/operation-guide';
import { TagConfigModel } from '../models/azure-lessons';
import { ListBaseModel } from '../models/common/base-model';

// 获取培训课程分类列表
export const getCategoryOperation = async() => {
    let result : OperationGuideCategoryModel[] = await axios(CATEGORY_OPERATION).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

// 获取培训课程课程列表
export const getOperationGuideCourses = async(query: OperationGuideQueryModel, data: string[]) => {
    let result : ListBaseModel<OperationGuideCourseModel> = await axios(COURSE_OPERATION, { params: query, method: 'post', data }).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {total: 0, data: []}
    });
    return result;
}

// 获取考试试题列表
export const getCourseExam = async(courseId: string) => {
    let result : CourseExamModel = await axios(`${COURSE_EXAM}/${courseId}`).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const getExamResult = async(data: ExamRequestModel) => {
    let result : ExamResponseModel = await axios(`${EXAM_RESULT}`, {method: 'post', data}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {};
    });
    return result;
}

// 课程tag数据
export const getCourseCategoryConfig = async() => {
    let result : TagConfigModel[] = await axios(COURSE_CATEGORY_CONFIG).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const seriesNumberExist = async(snNumbers: string) => {
    let result : boolean = await axios(SERIES_NUMBER_EXIST, {params: {snNumbers}}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return false;
    });
    return result;
}

// 获取用户SN
export const getUserSeriesNumber = async() => {
    let result : string = await axios(USER_SERIES_NUMBER).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

// 解锁用户SN
export const addUserSeriesNumber = async(data: string) => {
    let result : UserSNResponseModel = await axios(USER_SERIES_NUMBER, {method: 'post', data: JSON.stringify(data), transformRequest: [function(data, headers){headers!['content-type'] = 'application/json'; return data}]}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}