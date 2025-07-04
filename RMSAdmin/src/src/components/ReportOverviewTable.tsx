import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { IReportDateOverviewRspModel } from "models";
import moment from "moment";
import { FunctionComponent } from "react";

export const ReportOverviewTable : FunctionComponent<{currentReportDates: IReportDateOverviewRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentReportDates, loading, handleSelect}) => {
  const columns : ColumnsType<IReportDateOverviewRspModel> = [
    {
      title: '日期',
      dataIndex: 'dateTimeKey',
      key: 'dateTimeKey',
      ellipsis: true,
      width: '15%',
      render: (value: number) =>{
        return moment(value.toString(), "YYYYMMDD").format('YYYY/MM/DD')
      },
      sorter: (a, b) => a.dateTimeKey - b.dateTimeKey,
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
    },
    {
      title: '注册人数',
      dataIndex: 'registerCount',
      key: 'registerCount',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '访问人数',
      dataIndex: 'visitPersonCount',
      key: 'visitPersonCount',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '访问次数',
      dataIndex: 'visitCount',
      key: 'visitCount',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '转发',
      dataIndex: 'shareCount',
      key: 'shareCount',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '收藏',
      dataIndex: 'collectionCount',
      key: 'collectionCount',
      width: '10%',
    },
    {
      title: '完成（考试）',
      dataIndex: 'passExamCount',
      key: 'passExamCount',
      width: '10%',
    }
  ]

  return (
    <Table 
      loading={loading}
      dataSource={currentReportDates}
      size={'small'}
      rowKey={record => record.dateTimeKey} 
      columns={columns} />
  );
}