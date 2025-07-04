import { Button, Table } from "antd"
import React, { FunctionComponent } from "react";
import { IGroupManagerRspModel, IGroupStatusRspModel, IGroupManagerStatusRspModel} from "models";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

export const GroupManagerStatusTable : FunctionComponent<{currentGroupManagers: IGroupManagerStatusRspModel[] | undefined, loading: boolean, handleSelect: any}> 
= ({currentGroupManagers, loading, handleSelect}) => {  
  const columns : ColumnsType<IGroupManagerStatusRspModel> = [
    {
      title: '组长',
      dataIndex: 'manager',
      key: 'name',
      width: '15%',
      ellipsis: true,
      render: (value: IGroupManagerRspModel) => value.user.name
    },
    {
      title: '手机',
      dataIndex: 'manager',
      key: 'phoneNumber',
      width: '20%',
      ellipsis: true,
      render: (value: IGroupManagerRspModel) => value.user.phoneNumber
    },
    {
      title: '单位',
      dataIndex: 'manager',
      key: 'company',
      width: '15%',
      ellipsis: true,
      render: (value: IGroupManagerRspModel) => value.user.company
    },
    {
      title: '学习小组',
      dataIndex: 'groups',
      key: 'groupCount',
      width: '15%',
      ellipsis: true,
      render: (value: IGroupStatusRspModel[]) => value.length
    },
    {
      title: '人数',
      dataIndex: 'groups',
      key: 'userCount',
      ellipsis: true,
      width: '10%',
      render: (value: IGroupStatusRspModel[]) => {
        let userSet = new Set<string>()
        value.forEach(c=> c.users.forEach(t=> userSet.add(t)));
        const userCount = Array.from(userSet).length
        return userCount
      }
    },
    {
      title: '完成全部课程人数',
      dataIndex: 'groups',
      key: 'completeUserCount',
      ellipsis: true,
      width: '20%',
      render: (value: IGroupStatusRspModel[]) => {
        let userSet = new Set<string>()
        value.forEach(c=> c.completeUsers.forEach(t=> userSet.add(t)));
        const userCount = Array.from(userSet).length
        return userCount
      }
    },
    {
      title: '进度',
      dataIndex: 'groups',
      key: 'percent',
      ellipsis: true,
      width: '10%',
      render: (value: IGroupStatusRspModel[]) => {
        let userSet = new Set<string>()
        value.forEach(c=> c.users.forEach(t=> userSet.add(t)));
        const allUserCount = Array.from(userSet).length
        let completeUserSet = new Set<string>()
        value.forEach(c=> c.completeUsers.forEach(t=> completeUserSet.add(t)));
        const completeUserCount = Array.from(completeUserSet).length
        if(allUserCount > 0) {
          const result = Math.floor( completeUserCount * 100 / allUserCount)
          return `${result}%`
        }
        else {
          return `0%`
        }
      }
    },
    {
      title: '邀请人',
      dataIndex: 'manager',
      key: 'createdBy',
      ellipsis: true,
      width: '15%',
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
        <Button size='small' type="primary" onClick={()=> handleSelect(record)}>查看</Button>
      )
    }
  ]

  return (
    <>
      <Table 
        size={'small'}
        loading={loading}
        dataSource={currentGroupManagers}
        rowKey={c=>c.manager.id!}
        columns={columns} />
    </>
  )
}
