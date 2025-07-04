import { IReportDateOverviewRspModel } from "./IReportDateOverviewRspModel";

export interface IReportOverviewRspModel {
  registerCount: number,
  visitPersonCount : number,
  visitCount: number,
  androidCount : number,
  iPhoneCount : number,
  pcCount: number,
  otherDeviceCount : number,
  dateDatas: IReportDateOverviewRspModel[]
}