import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ICourseProgressRspModel, IUserRspModel } from 'models';
import React, { FunctionComponent } from 'react';

export const CourseProgressTable : FunctionComponent<{currentCourseProgress: ICourseProgressRspModel[] | undefined}> 
= ({currentCourseProgress}) => {  
  const columns : ColumnsType<ICourseProgressRspModel> = [
    {
      title: '姓名',
      dataIndex: 'user',
      key: 'name',
      ellipsis: true,
      width: '15%',
      render:(value: IUserRspModel) => value.name
    },
    {
      title: '手机',
      dataIndex: 'user',
      key: 'phoneNumber',
      ellipsis: true,
      width: '20%',
      render:(value: IUserRspModel) => value.phoneNumber
    },
    {
      title: '单位',
      dataIndex: 'user',
      key: 'company',
      ellipsis: true,
      width: '20%',
      render:(value: IUserRspModel) => value.company
    },
    {
      title: '区域',
      dataIndex: 'user',
      key: 'city',
      ellipsis: true,
      width: '20%',
      render:(value: IUserRspModel) => value.province ? `${value.province?.name}/${value.city?.name}` : undefined
    },
    {
      title: '行业',
      dataIndex: 'user',
      key: 'industry',
      ellipsis: true,
      width: '20%',
      render:(value: IUserRspModel) => value.industry?.name ?? value.industryText
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: '10%',
      render:(value: number) => `${value}%`
    }
  ]

  return (
    <Table 
      dataSource={currentCourseProgress}
      size={'small'}
      rowKey={record => record.user.id} 
      columns={columns} />
  );
}
