import { Col, List, Modal, Row, Tabs } from 'antd';
import { CategoryTable, Loading, SeriesNumberForm, TagGroup, TagInput } from 'components';
import { CategoryType, ICategoryReqModel, IQuickSearchReqModel, ISeriesNumberReqModel, ISeriesNumberRspModel, ISingleCategoryRspModel, isOfType, ITagGroupRspModel, ITagReqModel, ITagRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { CategoryService, HomeService, TagService } from 'services';

const { TabPane } = Tabs;
export type Flag = "Base" | "Banner" | "HotCourse"| "SelectCourse";
export const Tags : FunctionComponent = () => {
  
  const [tagGroups, setTagGroups] = useState<ITagGroupRspModel[]>();

  const [singleCategories, setSingleCategories] = useState<ISingleCategoryRspModel[]>();

  const [singleCategoryModel, setSingleCategoryModel] = useState<ISingleCategoryRspModel>();

  const [userTagGroup, setUserTagGroup] = useState<ITagGroupRspModel>();

  const [searchTagGroup, setSearchTagGroup] = useState<ITagGroupRspModel>();

  const [isLoading, setIsLoading] = useState(false);

  const [loadingTip, setLoadingTip] = useState<string>()

  const [showSeriesNumbers, setShowSeriesNumbers] = useState(false);

  const [deleteSeriesNumbers, setDeleteSeriesNumbers] = useState<ISeriesNumberRspModel[]>([]);

  const [activeKey, setActiveKey] = useState('1');

  const [isEditing, setIsEditing] = useState(false)

  let singleCategory = singleCategoryModel!

  const setSingleCategory = (props: Partial<ISingleCategoryRspModel>) => {
    setSingleCategoryModel({ ...singleCategory, ...props });
    setIsEditing(true)
  }

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  }

  const handleTagAdd = (tagGroup: ITagGroupRspModel, newValue: ITagRspModel) => {
    if(newValue.tagType === "Search"){
      const searchInput : IQuickSearchReqModel = {
        content: newValue.name
      }
      HomeService.addQuickSearchConfig(searchInput).then(() => {
        refreshQuickSearch()
      })
    }
    else if(newValue.tagType === "User") {
      if (tagGroup.id === undefined) {
        const input: ITagGroupRspModel= {
          name: "用户",
          displayInFilter: true,
          tags:[]
        }
    
        TagService.addTagGroup(input).then(() => {
          TagService.getTagGroups({name: "用户"}).then(rsp => {
            if(rsp && rsp.data) {
              const userTagGroup = rsp.data.find(c=>c.name === "用户")
              setUserTagGroup(userTagGroup)
              const input : ITagReqModel = {
                ...newValue,
              }
      
              TagService.addTag(userTagGroup?.id!, input).then(() => {
                refreshTagGroups()
              })
            }
          })
        })
      }
      else {
        const input : ITagReqModel = {
          ...newValue,
        }

        TagService.addTag(tagGroup.id, input).then(() => {
          refreshTagGroups()
        })
      }
    }
    else {
      if(tagGroup.id) {
        const input : ITagReqModel = {
          ...newValue,
        }

        TagService.addTag(tagGroup.id, input).then(() => {
          refreshTagGroups()
        })
      }
    }
  }

  const handleTagDelete = (tag: ITagRspModel) => {    
    if (tag.tagType === "Course") {
      TagService.deleteTag(tag.id!).then(() => {
        refreshTagGroups()
      })
    }
    else if(tag.tagType === "User") {
      TagService.deleteTag(tag.id!).then(() => {
        refreshTagGroups()
      })
    }
    else if(tag.tagType === "Search"){
      HomeService.deleteQuickSearchConfig(tag.id!).then(() => {
        refreshQuickSearch()
      })
    }
  }

  const handleTagGroupAdd = (newValue: string) => {
    const input: ITagGroupRspModel= {
      name: newValue,
      displayInFilter: true,
      tags:[]
    }

    TagService.addTagGroup(input).then(() => {
      refreshTagGroups()
    })
  }

  const handleTagGroupDelete = (tagGroup: ITagGroupRspModel) => {
    TagService.deleteTagGroup(tagGroup.id!).then(() => {
      refreshTagGroups()
    })
  }

  const handleCategoryManage = (category: ISingleCategoryRspModel) => {
    setSingleCategoryModel(category)
    setShowSeriesNumbers(true)
    setIsEditing(false)
    setDeleteSeriesNumbers([])
  }

  const handleCategorySave = () => {
    if(singleCategoryModel && isEditing) {
      const input : ICategoryReqModel = {
        ...singleCategoryModel,
        parent_Id: singleCategoryModel.parent?.id,
      }
      
      setShowSeriesNumbers(false)
      setIsLoading(true)
      setLoadingTip("保存分类...")
      if(singleCategoryModel.id) {
        let promiseList : Promise<unknown>[] = []
        deleteSeriesNumbers.forEach(sn => {
          promiseList.push(CategoryService.deleteSeriesNumber(sn.id!))
        })

        singleCategoryModel.seriesNumbers.forEach(sn => {
          const snInput : ISeriesNumberReqModel = {
            ...sn
          }

          if(sn.id) {
            promiseList.push(CategoryService.updateSeriesNumber(sn.id, snInput))
          }
          else {
            promiseList.push(CategoryService.addSeriesNumber(singleCategoryModel.id!, snInput))
          }
        })

        promiseList.push(CategoryService.updateCategory(singleCategoryModel.id, input))
        Promise.all(promiseList).then(() => {
          setIsLoading(false)
          refreshCategories()
        })
      }
    }
    else {
      setShowSeriesNumbers(false)
    }
  }

  const handleDeleteItem = (item : any) => {
    if(isOfType<ISeriesNumberRspModel>(item,  "seriesNumbers")) {
      if(item.id && deleteSeriesNumbers.findIndex(c=>c.id === item.id) < 0) {
        setDeleteSeriesNumbers([...deleteSeriesNumbers, item])
      }
    }
  }

  const refreshTagGroups = () => {
    setIsLoading(true)
    setLoadingTip("加载标签...")
    TagService.getTagGroups({}).then(rsp => {
      if(rsp && rsp.data) {
        setTagGroups(rsp.data.filter(c=>c.name !== "用户"));
        setUserTagGroup(rsp.data.find(c=>c.name === "用户"))
      }
      
      setIsLoading(false)
    })
  }

  const refreshQuickSearch = () => {
    HomeService.getQuickSearchConfig().then((rsp => {
      if(rsp && rsp instanceof Array) {
        const tagGroup: ITagGroupRspModel = {
          name: "",
          tags: rsp.map(c => { return { name: c.content, id: c.id, tagType: "Search" } as ITagRspModel}),
          displayInFilter: true
        }

        setSearchTagGroup(tagGroup)
      }
    }))
  }

  const refreshCategories = () => {
    setIsLoading(true)
    setLoadingTip("加载分类...")
    CategoryService.getSingleCategories().then((rsp => {
      if(rsp && rsp instanceof Array) {
        setSingleCategories(rsp)
      }      
      setIsLoading(false)
    }))
  }

  useEffect(() => {
    if(activeKey === "1") {
      refreshTagGroups()
      refreshQuickSearch()
    }
    else if(activeKey === "2") {
      refreshCategories()
    }
  }, [activeKey]);
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Row style={{marginTop: 10}}>        
        <Col offset={1} span={22}>
          <Tabs activeKey={activeKey} onChange={handleActiveTab}>
            <TabPane tab="标签" key="1">
              <Row style={{margin: 20}}>
                <Col span={12}>                  
                  <Row>
                    <Col>
                      云课堂标签
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <List
                        itemLayout="horizontal"
                        loading={false}
                        dataSource={tagGroups}
                        renderItem={(group, index) => (
                          <TagGroup 
                            currentTagGroup={group}
                            tagType={"Course"}
                            handleAdd={handleTagAdd} 
                            handleGroupDelete={handleTagGroupDelete} 
                            handleTagDelete={handleTagDelete} />
                        )}
                      />
                    </Col>
                  </Row>                  
                  <Row>
                    <Col style={{paddingLeft: 21, marginTop: 20}}>
                      <TagInput plusLabel="标签组" change={handleTagGroupAdd} />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col>
                      用户标签
                    </Col>
                  </Row>
                  <TagGroup 
                    currentTagGroup={userTagGroup} 
                    tagType={"User"} 
                    handleAdd={handleTagAdd} 
                    handleGroupDelete={undefined} 
                    handleTagDelete={handleTagDelete} />
                  <Row>
                    <Col>
                      热门搜索
                    </Col>
                  </Row>                  
                  <TagGroup 
                    currentTagGroup={searchTagGroup} 
                    tagType={"Search"} 
                    handleAdd={handleTagAdd} 
                    handleGroupDelete={undefined} 
                    handleTagDelete={handleTagDelete} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={`${CategoryType[1]}分类`} key="2">
              <Row>
                <Col span={24}>
                  <CategoryTable 
                    currentCategories={singleCategories} 
                    loading={false} 
                    handleSelect={handleCategoryManage} />
                </Col>
              </Row>              
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <Modal 
        title="序列号配置" 
        visible={showSeriesNumbers}
        centered={true}
        footer={null}
        onCancel={()=>setShowSeriesNumbers(false)} 
        destroyOnClose={true}
      >
        <SeriesNumberForm 
          currentCategory={singleCategoryModel} 
          categories={singleCategories} 
          update={setSingleCategory} 
          save={handleCategorySave}
          handleDeleteItem={handleDeleteItem} />
      </Modal>
    </>
  )
}