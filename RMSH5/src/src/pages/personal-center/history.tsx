import React, { useState, useEffect } from 'react';
import { List, Avatar, Breadcrumb } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HistoryLogModel } from '../../models/personal-center';
import { getHistoryLog } from '../../services/personal-center';
import '../../styles/infoCenter.scss';

export default function History() {
    const [historys, setHistorys] = useState<HistoryLogModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        getHistoryList();
    }, [])

    const getHistoryList = async() => {
        setLoading(true);
        await getHistoryLog().then(result => {
            setHistorys(result);
            setLoading(false);
        })
    }

    return (
        <>
        <Breadcrumb className='section_card itemTop'>
            <Breadcrumb.Item><Link to='/personalCenter'>个人中心</Link></Breadcrumb.Item>
            <Breadcrumb.Item>我的历史</Breadcrumb.Item>
        </Breadcrumb>
        <List
        loading={loading}
        itemLayout='horizontal'
        dataSource={historys}
        renderItem={item => (
            <List.Item
            onClick={() => item.categoryRootName === '云课堂' ? navigate(`/azureLessons/${item.courseId}`) : navigate(`/operationGuide/${item.courseId}`)}
            className='listItem line'
            actions={[item.lastBrowerDate]}>
                <List.Item.Meta
                avatar={<Avatar className='itemAvatar' src={item.contentPath} shape='square'/>}
                title={item.name}/>
            </List.Item>
        )}
        />
        </>
    )
}
