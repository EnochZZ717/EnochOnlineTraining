import axios from 'axios';
import { HttpStatusCode } from '../models/common/http-status-code';
import { CoursePublicModel, CoursePublicQueryModel, TagModel, CourseCollectionModel, CourseHistoryModel, TagConfigModel } from '../models/azure-lessons';
import { ListBaseModel } from '../models/common/base-model';
import { COURSE_PUBLIC, CATEGORY_PUBLIC, COURSE_DETAIL, COURSE_COLLECTION, HISTORY, TAG_CONFIG, HISTORY_LOG, WATCH_COMPLETED_COURSES } from './urls';

// 获取云课堂课程列表
export const getCoursePublicByTag = async(query: CoursePublicQueryModel, data: string[]) => {
    let result : ListBaseModel<CoursePublicModel> = await axios(COURSE_PUBLIC, { params: query, method: 'post', data}).then((response)  => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {total: 0, data: []}
    });
    return result;
}

// 获取云课堂课程标签列表
export const getCategoryPublic = async() => {
    let result : TagModel[]  = await axios(CATEGORY_PUBLIC).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return []
    });
    return result;
}

// 获取云课堂详情
export const getCourseDetail = async(id: string) => {
    let result : any = await axios(`${COURSE_DETAIL}/${id}`).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch((error) => {
        if(error.response.status === HttpStatusCode.Forbidden){
            return HttpStatusCode.Forbidden;
        }
        return {}
    });
    return result;
}

// 课程收藏
export const courseCollection = async(data: CourseCollectionModel) => {
    let result : boolean = await axios(COURSE_COLLECTION, {
        method: 'put',
        data
    }).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }else{
            return false;
        }
    }).catch(() => {
        return false;
    });
    return result;
}

// 取消课程收藏
export const cancelCourseCollection = async(data: CourseCollectionModel) => {
    let result : boolean = await axios(COURSE_COLLECTION, {
        method: 'delete',
        data
    }).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }else{
            return false;
        }
    }).catch(() => {
        return false;
    });
    return result;
}

// 记录播放历史
export const recordCourseHistory = async(data: CourseHistoryModel) => {
    let result : boolean = await axios(HISTORY, {
        method: 'post',
        data
    }).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }else{
            return false;
        }
    }).catch(() => {
        return false;
    });
    return result;
}

// 课程tag数据
export const getTagConfig = async() => {
    let result : TagConfigModel[] = await axios(TAG_CONFIG).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}  

// 记录用户观看课程
export const recordCourseLog = async(courseId: string) => {
    await axios(HISTORY_LOG, {method: 'put', data: {courseId}}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }
    }).catch(() => {
        return false;
    });
}

// 记录用户是否看完视频
export const recordWatchCompleted = async(courseID: string) => {
    await axios(WATCH_COMPLETED_COURSES, {method: 'post', params: {courseID}}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }
    }).catch(() => {
        return false;
    });
}