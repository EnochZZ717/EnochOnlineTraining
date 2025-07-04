import { Table, Button, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { CategoryType, ISeriesNumberRspModel, ISingleCategoryRspModel } from 'models';
import React, { FunctionComponent, useState } from 'react';

export const CategoryTable : FunctionComponent<{currentCategories: ISingleCategoryRspModel[] | undefined, loading: boolean, handleSelect: any}> 
= ({currentCategories, loading, handleSelect}) => {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [key, setKey] = useState(0);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>()
  const onCollapse = () => {
    setIsCollapsed(true);
    setKey(key + 1)
  };

  const isEditing = (record: ISingleCategoryRspModel) => record.id === currentCategoryId;  

  const columns : ColumnsType<ISingleCategoryRspModel> = [
    {
      title: `${CategoryType[1]}主目录`,
      dataIndex: 'parent',
      key: 'parent',
      ellipsis: true,
      width: '15%',
      render: (parent: ISingleCategoryRspModel) => parent.title
    },
    {
      title: `${CategoryType[1]}分类`,
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '25%',
    },
    {
      title: '序列号',
      dataIndex: 'seriesNumbers',
      key: 'seriesNumbers',
      ellipsis: true,
      width: '10%',
      render: (seriesNumbers: ISeriesNumberRspModel[], record: ISingleCategoryRspModel) => {
        const editable = isEditing(record);
        return (
          <div key={key} style={{paddingTop: 10}}>
            <Typography.Paragraph ellipsis={
              { 
                rows: 1, 
                expandable: true, 
                symbol: '更多',
                onExpand: () => {
                  setIsCollapsed(false)
                  setCurrentCategoryId(record.id)
                }
              }
            }>
              {
                seriesNumbers.map((c, index)=><><label key={index}>{c.seriesNumbers}</label><br /></>)
              }
              {
                !isCollapsed && editable ? <Typography.Link underline={false} onClick={onCollapse}>收起</Typography.Link> : undefined
              }
            </Typography.Paragraph>

          </div>
          
        )
      } 
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Button size='small' type="primary" onClick={() => handleSelect(record)}>编辑</Button>
      )
    }
  ]
  
  return (
    <>
      <Table 
        loading={loading}
        dataSource={currentCategories}
        pagination={{
          pageSize: 10
        }}
        rowKey={c=>c.id!}
        size='small'
        columns={columns} />
    </>    
  );
}
