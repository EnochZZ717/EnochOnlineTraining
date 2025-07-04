import React, { useEffect, useState } from 'react';
import { Avatar, Space, Spin } from 'antd';
import { RightOutlined, StarOutlined, HistoryOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getPersonaUserInfo } from '../../services/personal-center';
import { UserModel } from '../../models/personal-center';
import '../../styles/infoCenter.scss';

// 个人中心
export default function PersonalCenter() {
    const navigate = useNavigate();
    const [personalInfo, setPersonalInfo] = useState<UserModel>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        setLoading(true);
        getPersonaUserInfo().then(result => {
            setPersonalInfo(result);
            setLoading(false);
        })
    }, []);
    
    return (
        loading ? <div className='nodata'><Spin /></div> :
        <div className='itemTop'>
            <div className='row' onClick={() => {navigate('info', {state: personalInfo})}}>
                <Space>
                    <Avatar size={64} src={personalInfo?.weChatImagePath} />
                    <span>{personalInfo?.name}</span>
                </Space>
                <div>
                    <RightOutlined />
                </div>
            </div>
            <div className='row border' onClick={() => {navigate('collection')}}>
                <Space>
                    <StarOutlined />
                    <span>我的收藏</span>
                </Space>
                <div>
                    <RightOutlined />
                </div>
            </div>
            <div className='row border' onClick={() => {navigate('history')}}>
                <Space>
                    <HistoryOutlined />
                    <span>观看历史</span>
                </Space>
                <div>
                    <RightOutlined />
                </div>
            </div>
            <div className='row' onClick={() => {navigate('courses')}}>
                <Space>
                    <BulbOutlined />
                    <span>完成课程</span>
                </Space>
                <div>
                    <RightOutlined />
                </div>
            </div>
        </div>
    )
}
