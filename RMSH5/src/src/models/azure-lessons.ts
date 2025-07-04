import { BooleanLiteral } from "typescript";
import { BaseModel, QueryBaseModel } from "./common/base-model";

export interface CoursePublicModel extends BaseModel{
    name: string;
    description: string;
    coverImage: CoverImageModel;
    categoryRootName: string;
    isPublished: boolean;
    hits: number;
}

export interface CourseDetailModel extends BaseModel{
    name: string;
    description: string;
    points: number;
    duration: number;
    isPublished: boolean;
    sections: CourseSectionModel[];
    coverImage: CoverImageModel;
    isFavor: boolean;
    level: number;
    isPassedZExam: boolean;
    tagContent: string[];
    isWatchCompleted: boolean;
}

export interface CourseSectionModel extends BaseModel{
    title: string;
    description: string;
    duration: number;
    sequence: number;
    contentLink: string;
    contentType: string;
    assetName: string;
    nodes: SectionNodeModel[];
    watchedTime: number;
    isCompleted: boolean;
    isFavor: boolean;
    watchedPercent: number;
}

export interface SectionNodeModel extends BaseModel{
    title: string;
    description: string;
    startNumber: number;
    sequence: number;
    watchedTime: number;
    isCompleted: boolean;
    isFavor: boolean;
    endNumber: number;
}

export interface TagModel extends BaseModel{
    name: string;
}

export interface CoverImageModel extends BaseModel{
    contentPath: string;
    name?: string;
}

export interface CoursePublicQueryModel extends QueryBaseModel{
    Name?: string;
    FullName?: string;
    Description?: string;
    CourseCategory_Id?: string;
    CategoryName?: string;
}

export interface CourseCollectionModel{
    courseId?: string;
    sectionId?: string;
    sectionNodeId?: string;
}

export interface CourseHistoryModel{
    courseId?: string;
    sectionId?: string;
    sectionNodeId?: string;
    watchedTime: number;
    isCompleted: boolean;
}

export interface TagConfigModel{
    name: string;
    sequence: number;
    subNames: SubTagConfigModel[];
}

export interface SubTagConfigModel extends BaseModel{
    name: string;
}