import { Button, Table } from "antd"
import React, { FunctionComponent } from "react";
import { IGroupStatusRspModel, IUserRspModel } from "models";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

export const GroupStatusTable : FunctionComponent<{currentGroups: IGroupStatusRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentGroups, loading, handleSelect}) => {  
  const columns : ColumnsType<IGroupStatusRspModel> = [
    {
      title: '学习小组',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '人数',
      dataIndex: 'users',
      key: 'users',
      ellipsis: true,
      width: '10%',
      render: (value: any, record: IGroupStatusRspModel) => record.users.length
    },
    {
      title: '完成全部课程人数',
      dataIndex: 'completeUsers',
      key: 'completeUsers',
      width: '20%',
      render: (value: string[]) => {
        let userSet = new Set<string>()
        value.forEach(c=> userSet.add(c));
        const userCount = Array.from(userSet).length
        return userCount
      }
    },
    {
      title: '课程',
      dataIndex: 'courses',
      key: 'courses',
      ellipsis: true,
      width: '25%',
      render: (value: any, record: IGroupStatusRspModel) => record.courses?.length
    },
    {
      title: '完成比例',
      dataIndex: 'completePercent',
      key: 'completePercent',
      ellipsis: true,
      width: '25%',
      render: (value: number) => `${value}%`
    },
    {
      title: '邀请人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      ellipsis: true,
      width: '20%',
      render:(createdBy: IUserRspModel | undefined) => createdBy?.name
    },
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
        handleSelect && <Button size='small' type="primary" onClick={()=> handleSelect(record)}>查看</Button>
      )
    }
  ]

  return (
    <>
      <Table 
        size={'small'}
        loading={loading}
        dataSource={currentGroups}
        rowKey={record => record.id!}
        columns={columns} />
    </>
  )
}
