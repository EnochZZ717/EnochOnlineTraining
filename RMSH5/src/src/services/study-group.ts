import axios from 'axios';
import { HttpStatusCode } from '../models/common/http-status-code';
import { MemberGroup, MemberGroupQueryModel, GroupImage, GroupCourseModel, GroupRequestModel, MemberGroupCourseStatusModel, MemberGroupDetailModel, GroupEditRequestModel, MemberLearningStatusModel } from '../models/study-group';
import { MEMBER_GROUP, GROUP_IMAGE, GROUP_MANAGED_COURSE, MEMBER_GROUPS, MEMBER_GROUP_DETAIL } from './urls';

export const getMemberGroups = async(query: MemberGroupQueryModel) => {
    let result : MemberGroup[] = await axios(MEMBER_GROUPS, {params: query}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const getGroupImages = async() => {
    let result : GroupImage[] = await axios(GROUP_IMAGE).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const getGroupManagedCourses = async() => {
    let result : GroupCourseModel[] = await axios(GROUP_MANAGED_COURSE).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const addMemberGroup = async(data: GroupRequestModel) => {
    let result : boolean = await axios(MEMBER_GROUP, {method: 'put', data}).then(response => {
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

export const deleteMemberGroups = async(data: string[]) => {
    let result : boolean = await axios(MEMBER_GROUP, {method: 'delete', data}).then(response => {
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

export const getMemberGroupCourseStatus = async(data: string) => {
    let result : MemberGroupCourseStatusModel[] = await axios(`${MEMBER_GROUP}/${data}/Course/Status`).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const getMemberGroupDetail = async(data: string) => {
    let result : MemberGroupDetailModel = await axios(`${MEMBER_GROUP_DETAIL}/${data}`).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
    }).catch(() => {
        return {};
    });
    return result;
}

export const editMemberGroup = async(data: GroupEditRequestModel) => {
    let result : boolean = await axios(MEMBER_GROUP, {method: 'post', data}).then(response => {
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

export const getMemberLearningStatus = async(data: string) => {
    let result : MemberLearningStatusModel[] = await axios(`${MEMBER_GROUP}/${data}/MemberLearnningStatus`).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }else{
            return [];
        }
    }).catch(() => {
        return [];
    });
    return result;
}

export const removeGroupMember = async(groupId: string, userId: string) => {
    let result : boolean = await axios(`${MEMBER_GROUP}/${groupId}/User/${userId}`, {method: 'delete'}).then(response => {
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

export const inviteUserToGroup = async(groupId: string, invitedBy: string) => {
    let result : number = await axios(`${MEMBER_GROUP}/${groupId}/User/${invitedBy}`, {method: 'put'}).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }else{
            return 0;
        }
    }).catch(() => {
        return 0;
    });
    return result;
}
