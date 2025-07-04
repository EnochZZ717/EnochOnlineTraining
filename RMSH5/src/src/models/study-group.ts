import { QueryBaseModel, BaseModel } from './common/base-model';

export interface MemberGroup{
    userId: string;
    memberGroupId: string;
    name: string;
    memberCount: number;
    courseCount: number;
    completeCount: number;
    completePercent: number;
    isGroup: boolean;
    imagePath: string;
}

export interface MemberGroupQueryModel extends QueryBaseModel{

}

export interface GroupImage extends BaseModel{
    contentPath: string;
}

export interface GroupCourseModel extends BaseModel{
    name: string;
    categoryRootName: string;
    imagePath: string;
    isSelected: boolean;
}

export interface GroupRequestModel{
    name: string;
    imageLibraryId: string;
    memberGroupSelectdCourses: MemberGroupSelectedCourseModel[];
}

export interface GroupEditRequestModel extends BaseModel{
    name: string;
    imageLibraryId: string;
    memberGroupSelectdCourses: MemberGroupSelectedCourseModel[];
}

export interface MemberGroupSelectedCourseModel{
    courseId: string;
    sequence: number;
}

export interface MemberGroupCourseStatusModel{
    userId: string;
    memberGroupId: string;
    courseId: string;
    name: string;
    categoryRootName: string;
    contentPath: string;
    videosections: number;
    completedCount: number;
    examStatus: boolean;
    courseStatus: string;
}

export interface MemberGroupDetailModel extends BaseModel{
    name: string;
    imageId: string;
    imagePath: string;
    groupMangedCourses: GroupCourseModel[];
}

export interface MemberLearningStatusModel{
    userId: string;
    userName: string;
    profileImagePath: string;
    memberGroupId: string;
    memberGroupName: string;
    courseCount: number;
    completeCount: number;
    unCompleteCount: number;
    completePercent: number;
}