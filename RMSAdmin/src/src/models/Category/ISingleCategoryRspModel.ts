import { ISeriesNumberRspModel } from ".";

export interface ISingleCategoryRspModel {
  id?: string,
  parent?: ISingleCategoryRspModel,
  title: string,
  description: string,
  displayInFilter: boolean,
  sequence: number,
  seriesNumbers: ISeriesNumberRspModel[]
}