import { Table, Form, Input, InputNumber } from "antd"
import React, { FunctionComponent, useState } from "react";
import { ISectionNodeModel } from "models";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { ConfirmModal } from "./ConfirmModal";
import { TableButtonGroup } from "components";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: ISectionNodeModel;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input size="small" />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0, width: '100%' }}
          rules={[
            {
              required: true
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const SectionNodeTable : FunctionComponent<{originSectionNodes: ISectionNodeModel[] | undefined, loading: boolean, handleSave: any, handlePlay: any, handleDelete: any, isPublished?: boolean}> 
= ({originSectionNodes, loading, handleSave, handlePlay, handleDelete, isPublished}) => {
  
  const [editingNode, setEditingNode] = useState<number>();
  const [form] = Form.useForm();

  const isEditing = (record: ISectionNodeModel) => record.startNumber === editingNode;
  const columns : ColumnsType<ISectionNodeModel> = [
    {
      title: '节点名',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '20%',
      onCell: (record: ISectionNodeModel, index?: number) => ({
        record,
        inputType: 'text',
        dataIndex: 'title',
        title: '节点名',
        editing: isEditing(record),
      }),
    },
    {
      title: '开始时间',
      dataIndex: 'startNumber',
      key: 'startNumber',
      width: '10%',
      render: (startNumber: number, record: ISectionNodeModel) => `${moment.unix(record.startNumber).utc().format('HH:mm:ss')}`,
    },
    {
      title: '结束时间',
      dataIndex: 'endNumber',
      key: 'endNumber',
      width: '10%',
      render: (endNumber: number, record: ISectionNodeModel) => `${moment.unix(record.endNumber).utc().format('HH:mm:ss')}`,
    },
    {
      title: '',
      key: 'action',
      width: '25%',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? 
          <TableButtonGroup btnProps={[
            {
              onClick: ()=> save(record),
              title: "保存"
            }, 
            {
              onClick: () => setEditingNode(undefined),
              hidden: isPublished,
              title: "取消"
            },
          ]} /> :
          <TableButtonGroup btnProps={[
            {
              onClick: ()=> edit(record),
              hidden: isPublished,
              title: "编辑"
            }, 
            {
              onClick: ()=> handlePlay(record),
              title: "播放"
            },
            {
              onClick: () => deleteConfirm(record),
              hidden: isPublished || record.sequence ===0,
              title: "删除"
            },
          ]} />
      }
    },
  ]

  const edit = (record: ISectionNodeModel) => {
    setEditingNode(record.startNumber)
    form.setFieldsValue(record);
  }

  const deleteConfirm = (record: ISectionNodeModel) => {
    ConfirmModal({
      title: "是否删除节点", 
      confirm: () => handleDelete(record)
    })
  }

  const save = async (record: ISectionNodeModel) => {
    const newData = (await form.validateFields()) as ISectionNodeModel;
    handleSave({...record, ...newData})
    setEditingNode(undefined)
  }

  return (
    <Form form={form} component={false}>
      <Table
        loading={loading}
        showHeader={false}
        components={{
          body: {
            cell: EditableCell
          }
        }}
        dataSource={originSectionNodes}
        size={'small'}
        pagination={false}
        rowKey={record => record.sequence}
        columns={columns} />
    </Form>    
  )
}