import axios from 'axios';
import { HttpStatusCode } from '../models/common/http-status-code';
import { HomeModel, VideoTokenModel, CourseTypeModel } from '../models/home';
import { HomeSearchQueryModel, HotCourseQueryModel } from '../models/home';
import { HOME, VIDEO_TOKEN, HOME_SEARCH, QUICK_SEARCH_CONFIG } from './urls';

export const getHomeData = async(params: HotCourseQueryModel) => {
    let result : HomeModel = await axios(HOME, { params }).then((response)  => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {};
    });
    return result;
}

export const getVideoToken = async(sectionId: string) => {
    let result : VideoTokenModel = await axios(`${VIDEO_TOKEN}/${sectionId}.m3u8`).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return null;
    });
    return result;
}

export const getAllCoursesByHomeSearch = async(query: HomeSearchQueryModel) => {
    let result : CourseTypeModel = await axios(`${HOME_SEARCH}/${query.searchStr}`, { params: query }).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return null;
    });
    return result;
}

export const getQuickSearchConfig = async() => {
    let result : string[] = await axios(QUICK_SEARCH_CONFIG).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}