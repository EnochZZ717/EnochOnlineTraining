import { IUserRspModel } from "models";

export interface ICourseProgressRspModel {
  user: IUserRspModel,
  progress: number,
}