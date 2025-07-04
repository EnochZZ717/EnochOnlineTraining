import { BaseModel, QueryBaseModel } from "./common/base-model";
import { CoverImageModel } from './azure-lessons';

export interface OperationGuideCategoryModel extends BaseModel{
    name: string;
    childNodes: OperationGuideCategoryModel[]
}

export interface OperationGuideCourseModel extends BaseModel{
    name: string;
    coverImage: CoverImageModel;
    isPublished: boolean;
}

export interface OperationGuideQueryModel extends QueryBaseModel{
    Name?: string;
    Description?: string;
    CourseCategory_Id?: string;
}

export interface CourseExamModel{
    description: string;
    imagePath: string;
    questions: QuestionModel[];
    title: string[];
}

export interface QuestionModel extends BaseModel{
    stem: string;
    type: string;
    questionOptions: QuestionOptionModel[];
    answers: QuestionOptionModel[];
}

export interface QuestionOptionModel extends BaseModel{
    optionContent: string;
}

export interface ExamRequestModel{
    courseId: string;
    questions: ExamQuestionRequestModel[];
}

export interface ExamQuestionRequestModel{
    questionId: string;
    optionIds: string[];
}

export interface ExamResponseModel{
    result: string;
    examStatus: boolean;
    point: number;
}

export interface UserSNResponseModel{
    status: string;
    errorMessage: string;
}