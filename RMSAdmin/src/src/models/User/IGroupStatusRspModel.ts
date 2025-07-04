import { ICourseRspModel, IUserRspModel } from "..";
export interface IGroupStatusRspModel {
  id?: string,
  name: string,
  courses: ICourseRspModel[],
  users: string[],
  completePercent: number,
  completeUsers: string[],
  createdDate: Date,
  createdBy: IUserRspModel
}