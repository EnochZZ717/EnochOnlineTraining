import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IUserRspModel } from 'models';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

export const UserTable : FunctionComponent<{currentUsers: IUserRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentUsers, loading, handleSelect}) => {
  const columns : ColumnsType<IUserRspModel> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '手机',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '区域',
      dataIndex: 'city',
      key: 'city',
      ellipsis: true,
      width: '20%',
      render:(value: any, record: IUserRspModel) => record.province ? `${record.province?.name}/${record.city?.name}` : undefined
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      ellipsis: true,
      width: '20%',
      render:(value: any,record: IUserRspModel) => record.industry?.name ?? record.industryText
    },
    {
      title: '组长',
      dataIndex: 'isMemberGroupLeader',
      key: 'isMemberGroupLeader',
      ellipsis: true,
      width: '10%',
      render:(value: boolean ,record: IUserRspModel) => value ? "是" : "否"
    },
    // {
    //   title: '邀请人',
    //   dataIndex: 'createdBy',
    //   key: 'createdBy',
    //   ellipsis: true,
    //   width: '20%',
    //   render:(createdBy: IUserRspModel) => createdBy?.name
    // },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      ellipsis: true,
      width: '20%',
      render:(createdDate: Date) => moment(createdDate).format('YYYY-MM-DD'),
    },
    {
      title: '',
      key: 'action',
      width: handleSelect === undefined? '0' :'30%',
      render: (text, record) => (
        handleSelect && <Button size='small' disabled={record.isMemberGroupLeader} type="primary" onClick={()=> handleSelect(record)}>设为组长</Button>
      )
    }
  ]

  return (
    <Table 
      loading={loading}
      dataSource={currentUsers}
      size={'small'}
      rowKey={record => record.id} 
      columns={columns} />
  );
}
