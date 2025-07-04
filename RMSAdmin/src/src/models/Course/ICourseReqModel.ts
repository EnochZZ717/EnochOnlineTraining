import { IPaperReqModel } from "models";
import { ICourseCategoryReqModel, ICourseQuestionReqModel, ICourseTagReqModel, ISectionReqModel } from ".";

export interface ICourseReqModel {
    name: string,
    fullName: string,
    description: string,
    coverImageId?: string,
    duration: number,
    points: number,
    level: number,
    courseTags?: ICourseTagReqModel[],
    keywords?: string,
    isHot: boolean,
    isPublished?: boolean,
    courseCategories?: ICourseCategoryReqModel[],
    categoryRootName?: string,
    sections?: ISectionReqModel[],
    courseQuestions?: ICourseQuestionReqModel[],
    paper?: IPaperReqModel,
};