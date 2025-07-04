import React, { useState, useRef } from 'react'
import { Input, message, List } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, UndoOutlined } from '@ant-design/icons';
import { seriesNumberExist, addUserSeriesNumber } from '../../services/operation-guide';
import '../../styles/login.scss';

export default function EditableTagGroup(props: {datas: string[], callback: CallableFunction, needToDB: Boolean}) {
    const {datas, callback, needToDB} = {...props};
    const [tags, setTags] = useState<string[]>(datas ?? []);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<Input>(null);
    const [editInputIndex, setEditInputIndex] = useState<Number>(-1);
    const [editInputValue, setEditInputValue] = useState<string>('');
    const editInputRef = useRef<Input>(null);

    const handleAddSN = () => {
        let inputValue = inputRef.current?.state.value?.trim();
        if(inputValue){
            setLoading(true);
            if(tags.includes(inputValue)){
                message.destroy();
                message.warn('SN号已经存在');
                setLoading(false);
            }else{
                seriesNumberExist(inputValue).then(result => {
                    if(!result){
                        message.destroy();
                        message.warn('SN不存在');
                        setLoading(false);
                    }else{
                        if(needToDB){
                            // 如果SN存在，添加进数据库
                            let snsStr = [...tags, inputValue].join(',');
                            addUserSeriesNumber(`${snsStr}`).then(result => {
                                if(result.status === 'Success'){
                                    inputRef.current?.setValue('');
                                    setTags([...tags, inputValue]);
                                    callback([...tags, inputValue])
                                }else{
                                    message.destroy();
                                    message.warn('解锁SN失败， 请稍后再试');
                                }
                                setLoading(false);
                            })
                        }else{
                            inputRef.current?.setValue('');
                            setTags([...tags, inputValue]);
                            callback([...tags, inputValue]);
                            setLoading(false);
                        }
                    }
                })
            }
        }else{
            message.destroy();
            message.info('请输入SN号');
        }
    }

    const handleRemoveSN = (e: any, sn: string) => {
        e.stopPropagation();
        setLoading(true);
        let newSns = tags.filter(item => item !== sn);
        let snsStr = newSns.join(',');
        if(needToDB){
            addUserSeriesNumber(`${snsStr}`).then(result => {
                if(result.status === 'Success'){
                    setTags(newSns);
                    callback(newSns);
                }else{
                    message.destroy();
                    message.warn('移除SN失败， 请稍后再试');
                }
                setLoading(false);
            })
        }else{
            setTags(newSns);
            callback(newSns);
            setLoading(false);
        }
    }

    const handleEditInputChange = (e: any) => {
        setEditInputValue(e.target.value);
    }

    const handleEditInputConfirm = (e: any, item: string) => {
        e.stopPropagation();
        let editValue = editInputRef.current?.state.value?.trim();
        if(editValue && editValue !== item){
            setLoading(true);
            if(tags.includes(editValue)){
                message.destroy();
                message.warn('SN号已经存在');
                setLoading(false);
            }else{
                
                seriesNumberExist(editValue).then(result => {
                    if(!result){
                        message.destroy();
                        message.warn('SN不存在');
                        setLoading(false);
                    }else{
                        let newTags = [...tags.filter(t => t !== item), editValue];
                        if(needToDB){
                            // 如果SN存在，添加进数据库
                            let snsStr = newTags.join(',');
                            addUserSeriesNumber(`${snsStr}`).then(result => {
                                if(result.status === 'Success'){
                                    setTags(newTags);
                                    callback(newTags)
                                }else{
                                    message.destroy();
                                    message.warn('解锁SN失败， 请稍后再试');
                                }
                                setLoading(false);
                            })
                        }else{
                            setTags(newTags);
                            callback(newTags);
                            setLoading(false);
                        }
                    }
                })
            }
            setEditInputIndex(-1);
            setEditInputValue('');
        }else{
            if(!editValue){
                message.destroy();
                message.info('请输入SN号');
            }else{
                setEditInputIndex(-1);
                setEditInputValue('');
            }
        }
    }

    const handleDoubleClickList = (e: any, index: number, item: string) => {
        e.preventDefault();
        setEditInputIndex(index);
        setEditInputValue(item);
        editInputRef.current?.focus();
    }

    return (
    <>
        <Input allowClear onPressEnter={handleAddSN} addonAfter={<PlusOutlined onClick={handleAddSN}/>} ref={inputRef} placeholder='请输入SN号' bordered={true}/>
        <List
        loading={loading}
        itemLayout='horizontal'
        dataSource={tags}
        className='snList'
        size='small'
        renderItem = {(item, index) => {
            if(editInputIndex === index){
                return (
                    <Input
                        ref={editInputRef}
                        key={item}
                        style={{margin: '10px auto'}}
                        value={editInputValue}
                        onChange={handleEditInputChange}
                        onPressEnter={(e) => {handleEditInputConfirm(e, item)}}
                        addonAfter={<><UndoOutlined title='取消' onClick={(e) => {e.stopPropagation(); setEditInputIndex(-1); setEditInputValue('');}}/>&nbsp;&nbsp;<CheckOutlined title='确认' onClick={(e) => {handleEditInputConfirm(e, item)}}/></>}
                        placeholder='请输入SN号'
                    />
                )
            }
            return (
                <List.Item onDoubleClick={(e) => {handleDoubleClickList(e, index, item)}} actions={[<DeleteOutlined onClick={(e) => {handleRemoveSN(e, item)}}/>]}>
                    <List.Item.Meta
                    title={item}
                    />
                </List.Item>
            )
        }}
        />
    </>
    )
}
