import { Table, Image, Row, Tag, Tooltip } from "antd"
import React, { FunctionComponent, useEffect, useState } from "react";
import { CategoryType, IAssetRspModel, ICourseQueryOption, ICourseRspModel, ITagRspModel, IUserRspModel } from "models";
import { EditOutlined, ProfileOutlined } from '@ant-design/icons';
import { CourseService  } from "services";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import queryString from 'query-string';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loading, TableButtonGroup } from "components";

export const CourseTable : FunctionComponent<{originSelected: ICourseRspModel[] | undefined, categoryRootName: string,updateMethod: any, preview: any, isPublished?: boolean}> 
= ({originSelected, categoryRootName, isPublished, updateMethod, preview}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentService = CourseService;

  const [courses, setCourses] = useState<ICourseRspModel[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()
  
  const columns : ColumnsType<ICourseRspModel> = [
    {
      title: '缩略图',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 170,
      render: (asset: IAssetRspModel| undefined) => (asset ? <Image style={{width: 150, height: 80}} preview={false} src={asset.contentPath} /> : <div className="course-empty-image">课程封面</div>)
    },    
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '25%',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '13%',
      ellipsis: true,
      render: (tags: ITagRspModel[], record: ICourseRspModel) => tagElements(record),
      responsive: ['xl'],
    },
    {
      title: '类型',
      dataIndex: 'level',
      key: 'level',
      width: categoryRootName === CategoryType[0] ? '0' : '10%',      
      ellipsis: true,
      render: (value: number) => 
      {
        switch(value) {
          case 1:
            return '公共课程';
          case 2:
            return '系列课程';
        }
      },
      responsive: ['md'],
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: categoryRootName === CategoryType[0] ? '18%' : '8%',
      ellipsis: true,
      filters: isPublished ?  [
        {
          text:'发布',
          value:true,
        },
        {
          text:'未发布',
          value:false,
        }
      ] :
      [
        {
          text:'发布',
          value:true,
        },
        {
          text:'未发布',
          value:false,
        },
        {
          text:'草稿',
          value:0,
        }
      ],
      onFilter: (value, record) => value === 0 ? record.isPublished === null : record.isPublished === value,
      render: (state: boolean) => 
      {
        switch(state) {
          case false:
            return '未发布';
          case true:
            return '发布';
          default:
            return '草稿'
        }
      },
      responsive: ['md'],
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: '10%',
      render: (createdBy: IUserRspModel | undefined ) => createdBy && createdBy.name,
      responsive: ['xl'],
    },
    {
      title: '发布时间',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      width: '10%',
      ellipsis: true,
      render: (publishedDate: Date | undefined) => publishedDate && moment(publishedDate).format('YYYY-MM-DD'),
      sorter: (a, b) => compareDate(a, b),
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <TableButtonGroup btnProps={[
          {
            onClick: () => handleEdit(record),
            title: "查看"
          }, 
          {
            onClick: ()=> preview(record),
            disabled: record.isPublished === null,
            title: "预览"
          },
        ]} />
      ),
      responsive: ['sm'],
    },
    {
      title: '',
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <TableButtonGroup btnProps={[
          {
            onClick: () => handleEdit(record),
            icon: <EditOutlined />
          }, 
          {
            onClick: ()=> preview(record),
            disabled: record.isPublished === null,
            icon: <ProfileOutlined />
          },
        ]} size="small" />
      ),
      responsive: ['xs'],
    }
  ]

  const handleEdit = (record: ICourseRspModel) => {
    let url = `/courses/${record.id}`
    if(isPublished !== undefined) {
      url = `/publishCourses/${record.id}`
    }

    navigate(url)
  }

  const tagElements = (record: ICourseRspModel) => {
    return (
      <Row>
        {
          record.categoryRootName === CategoryType[0] ? 
          record.tags.filter(c=>c.tagType !== "User").map((tag, index)=> {
            const isLongTag = tag.name.length > 10;  
            const tagElem = (
              <Tag
                style={{marginTop: 2}}
                key = {index}
                closable={false}
              >
                {isLongTag ? `${tag.name.slice(0, 10)}...` : tag.name}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag.name} key={index}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          }) : 
          record.categories?.map((tag, index)=> {
            const isLongTag = tag.title.length > 10;  
            const tagElem = (
              <Tag
                style={{marginTop: 2}}
                key = {index}
                closable={false}
              >
                {isLongTag ? `${tag.title.slice(0, 10)}...` : tag.title}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag.title} key={index}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })
        }
      </Row>
    )    
  }

  const compareDate = (a: ICourseRspModel, b: ICourseRspModel)=> {
    const left = a.publishedDate ? moment(a.publishedDate).unix() : 0;
    const right = b.publishedDate ? moment(b.publishedDate).unix() : 0;
    return left - right;
  }

  const refresh = (query: Partial<ICourseQueryOption>) => {
    query.categoryRootName = categoryRootName
    setIsLoading(true);
    setLoadingTip("加载课程...")
    if(isPublished === undefined) {
      currentService.getCourses(query).then(rsp => {
        if(rsp && rsp.data instanceof Array) {
          setCourses([...rsp.data]);
        }
        setIsLoading(false);
      });
    }
    else {
      currentService.getPublishCourses(query).then(rsp => {
        if(rsp && rsp.data instanceof Array) {
          setCourses([...rsp.data]);
        }
        setIsLoading(false);
      });
    }
    
  }

  const handleSelect = (selectedRowKeys: React.Key[], selectedRows: ICourseRspModel[])=> 
  {
    updateMethod(selectedRows);
  }

  const getSelectRowKeys =() => {
    if(originSelected) {
      return originSelected.map(c=>c.id!);
    }
    else {
      return []
    }
  }

  useEffect(() => {
    const query: Partial<ICourseQueryOption> = queryString.parse(searchParams.toString())
    refresh(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isPublished]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip}  />
      <Table 
        rowSelection=
        {            
          {
            columnWidth: "0", 
            onChange: handleSelect,
            selectedRowKeys: getSelectRowKeys()
          }
        }
        onRow={(record) => {
          return {
            onClick: () => {
              if(originSelected) {
                const index = originSelected.findIndex(c=>c.id === record.id);
                if(index < 0){
                  updateMethod([...originSelected, record])
                }
                else {
                  const oldSelected = originSelected;
                  oldSelected.splice(index, 1);
                  updateMethod([...oldSelected])
                }
              }
              else {
                updateMethod([record])
              }
            }
          }
        }}
        dataSource={courses}
        size={'small'}
        rowKey={'id'}
        columns={columns} />
    </>
    
  )
}