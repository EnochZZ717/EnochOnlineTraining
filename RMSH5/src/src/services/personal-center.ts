import axios from 'axios';
import { HttpStatusCode } from '../models/common/http-status-code';
import { COLLECTIONS, HISTORY, REGISTER, HISTORY_LOG, USER_IMAGE, COMPLETED_COURSES } from './urls';
import { ListBaseModel } from '../models/common/base-model';
import { CollectionModel, CollectionQueryModel, HistoryQueryModel, HistoryModel, UserModel, HistoryLogModel, CompletedCoursesQueryModel, CompletedCoursesModel } from '../models/personal-center';
import { CoverImageModel } from '../models/azure-lessons';

export const getCollections = async(data: CollectionQueryModel) => {
    let result : ListBaseModel<CollectionModel> = await axios(COLLECTIONS, {params: data}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {total: 0, data: []}
    })
    return result;
}

export const getHistorys = async(data: HistoryQueryModel) => {
    let result : ListBaseModel<HistoryModel> = await axios(HISTORY, {params: data}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {total: 0, data: []}
    })
    return result;
}

export const getHistoryLog = async() => {
    let result : HistoryLogModel[] = await axios(HISTORY_LOG).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return []
    })
    return result;
}

export const getPersonaUserInfo = async() => {
    let result : UserModel = await axios(REGISTER).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {};
    })
    return result;
}

export const uploadUserImage = async(file: File) => {
    let params = new FormData();
    params.append('file', file);
    let result : CoverImageModel[] = await axios(USER_IMAGE, {method: 'post', data: params, headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const getCompletedCourses = async(data: CompletedCoursesQueryModel) => {
    let result : ListBaseModel<CompletedCoursesModel> = await axios(COMPLETED_COURSES, {params: data}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {total: 0, data: []}
    })
    return result;
}