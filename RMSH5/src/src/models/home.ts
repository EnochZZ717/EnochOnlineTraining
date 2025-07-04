import { BaseModel, QueryBaseModel } from './common/base-model';
import { CoverImageModel, CoursePublicModel } from './azure-lessons';

export interface HomeModel extends BaseModel{
    bannerImageList: BannerImageModel[];
    secondRowImageList: CourseTypeImageModel[];
    hotCourseList: HotCourseModel[];
    hotCourseCount: number;
}

export interface HotCourseModel extends BaseModel{
    name: string;
    description: string;
    isPublished: boolean;
    categoryRootName: string;
    coverImage: CoverImageModel;
}

export interface VideoTokenModel{
    contentPath: string;
    token: string;
}

export interface HomeSearchQueryModel extends QueryBaseModel{
    searchStr: string;
}

export interface BannerImageModel{
    id: string;
    imagePath: string;
    isPublished: boolean;
    categoryType: string;
}

export interface CourseTypeImageModel{
    imagePath: string;
    categoryType: string;
}

export interface HotCourseQueryModel extends QueryBaseModel{

}

export interface CourseTypeModel{
    currentMemberGroupCourses: CoursePublicModel[],
    publicCourses: CoursePublicModel[],
    opeartionCourses: CoursePublicModel[]
}