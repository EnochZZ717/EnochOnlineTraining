import { $fetch, IFetchProps } from "./BaseService"
import { ICategoryReqModel, ICategoryRspModel, ISeriesNumberReqModel, ISeriesNumberRspModel, ISingleCategoryRspModel } from "models";

const Api = {  
  getCategories: () => ({ method: "GET", url: `category` } as IFetchProps),
  updateCategory: (id: string, category: ICategoryReqModel) => ({ method: "PUT", url: `category/${id}`, body: category } as IFetchProps),

  getSeriesNumbers: (categoryId: string) => ({ method: "GET", url: `category/${categoryId}/seriesNumbers` } as IFetchProps),
  addSeriesNumber: (categoryId: string, input: ISeriesNumberReqModel) => ({ method: "POST", url: `category/${categoryId}/seriesNumbers`, body: input } as IFetchProps),
  updateSeriesNumber: (id: string, input: ISeriesNumberReqModel) => ({ method: "PUT", url: `seriesNumbers/${id}`, body: input } as IFetchProps),
  deleteSeriesNumber: (id: string) => ({ method: "DELETE", url: `seriesNumbers/${id}` } as IFetchProps),

  getSingleCategories: () => ({ method: "GET", url: `singleCategories` } as IFetchProps),
}
  
export const CategoryService = {
  getCategories: async () => $fetch<ICategoryRspModel[]>(Api.getCategories()),
  updateCategory: async (id: string, category: ICategoryReqModel) => $fetch(Api.updateCategory(id, category)),

  getSingleCategories: async () => $fetch<ISingleCategoryRspModel[]>(Api.getSingleCategories()),

  getSeriesNumbers: async (categoryId: string) => $fetch<ISeriesNumberRspModel[]>(Api.getSeriesNumbers(categoryId)), 
  addSeriesNumber: async (categoryId: string, input: ISeriesNumberReqModel) => $fetch(Api.addSeriesNumber(categoryId, input)),
  updateSeriesNumber: async (id: string, input: ISeriesNumberReqModel) => $fetch(Api.updateSeriesNumber(id, input)),
  deleteSeriesNumber: async (id: string) => $fetch(Api.deleteSeriesNumber(id)),
}