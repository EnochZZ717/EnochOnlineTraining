import { BaseModel, QueryBaseModel } from './common/base-model';
import { CommonBaseModel } from './common-data';

export interface CollectionModel extends BaseModel{
    courseId: string;
    courseName: string;
    courseImagePath: string;
    sectionID: string;
    sectionNodeID: string;
    title: string;
    description: string;
    contentLink: string;
    categoryRootName: string;
    isCancel: boolean;
}

export interface CollectionQueryModel extends QueryBaseModel{

}

export interface CompletedCoursesQueryModel extends QueryBaseModel{

}

export interface CompletedCoursesModel extends BaseModel{
    name: string;
    description: string;
    coverImagePath: string;
    isPublished: boolean;
    categoryRootName: string;
    completedDate: string;
}

export interface HistoryModel extends BaseModel{
    courseId: string;
    sectionID: string;
    title: string;
    description: string;
    contentLink: string;
    isCompleted: boolean;
    watchedTime: number;
    duration: number;
    watchedPercent: number;
    courseImagePath: string;
}

export interface HistoryQueryModel extends QueryBaseModel{

}

export interface UserModel extends BaseModel{
    name: string;
    phoneNumber: string;
    email: string;
    company: string;
    jobTitle: string;
    college: string;
    status: boolean;
    industry: CommonBaseModel;
    province: CommonBaseModel;
    city: CommonBaseModel;
    businessType: CommonBaseModel;
    seriesNumbers: string;
    isMemberGroupMember: boolean;
    isMemberGroupLeader: boolean;
    profileImagePath: string;
    unionId: string;
    weChatImagePath: string;
    technicalOffice: string;
    department: string;
    isMailReceiver: boolean;
    industryText: string;
    experimentalRequirement: string;
}

export interface HistoryLogModel{
    courseId: string;
    name: string;
    categoryRootName: string;
    contentPath: string;
    lastBrowerDate: string;
}