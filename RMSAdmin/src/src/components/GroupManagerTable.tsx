import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IGroupManagerRspModel, IGroupManagerStatusRspModel, IGroupStatusRspModel } from 'models';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

export const GroupManagerTable : FunctionComponent<{currentGroupManagers: IGroupManagerStatusRspModel[] | undefined, loading: boolean, handleSelect: any}> 
= ({currentGroupManagers, loading, handleSelect}) => {  
  const columns : ColumnsType<IGroupManagerStatusRspModel> = [
    {
      title: '姓名',
      dataIndex: 'manager',
      key: 'name',
      ellipsis: true,
      width: '15%',
      render:(manager: IGroupManagerRspModel) => manager.user.name
    },
    {
      title: '手机',
      dataIndex: 'manager',
      key: 'phoneNumber',
      ellipsis: true,
      width: '20%',
      render:(manager: IGroupManagerRspModel) => manager.user.phoneNumber
    },
    {
      title: '单位',
      dataIndex: 'manager',
      key: 'company',
      ellipsis: true,
      width: '15%',
      render:(manager: IGroupManagerRspModel) => manager.user.company
    },
    {
      title: '区域',
      dataIndex: 'manager',
      key: 'city',
      ellipsis: true,
      width: '20%',
      render:(value: IGroupManagerRspModel) => value.user.province ? `${value.user.province?.name}/${value.user.city?.name}` : undefined
    },
    {
      title: '课程数',
      dataIndex: 'manager',
      key: 'courses',
      ellipsis: true,
      width: '20%',
      render:(value: IGroupManagerRspModel) => value.courses && value.courses.length
    },
    {
      title: '小组数',
      dataIndex: 'groups',
      key: 'groups',
      ellipsis: true,
      width: '20%',
      render:(value: IGroupStatusRspModel[]) => value && value.length
    },
    
    {
      title: '邀请人',
      dataIndex: 'manager',
      key: 'createdBy',
      ellipsis: true,
      width: '20%',
      render:(value: IGroupManagerRspModel) => value.createdBy?.name
    },
    {
      title: '创建时间',
      dataIndex: 'manager',
      key: 'createdDate',
      ellipsis: true,
      width: '20%',
      render:(value: IGroupManagerRspModel) => value.createdDate && moment(value.createdDate).format('YYYY-MM-DD'),
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        handleSelect && <Button size='small' type="primary" onClick={()=> handleSelect(record)}>编辑</Button>
      )
    }
  ]

  return (
    <Table 
      loading={loading}
      dataSource={currentGroupManagers}
      size={'small'}
      rowKey={record => record.manager.id!} 
      columns={columns} />
  );
}
