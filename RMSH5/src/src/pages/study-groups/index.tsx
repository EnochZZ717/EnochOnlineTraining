import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'antd/lib/pagination';
import { List, Avatar, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MemberGroup, MemberGroupQueryModel } from '../../models/study-group';
import { getMemberGroups } from '../../services/study-group';
import { paginationConfig } from '../../utilities/pagination';
import { USER_PROFILE } from '../../models/common/sys-msg';
import { AuthorizationPage } from '../error-page';
import '../../styles/studyGroup.scss';

// 学习小组
export default function StudyGroups() {
    const [groups, setGroups] = useState<MemberGroup[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');
    const pagination : PaginationProps = paginationConfig(
        total, 
        currentPage, 
        (page: number, pageSize?: number) => {
            setCurrentPage(page);
            getMemberGroupList({PageNo: page, PageSize: pageSize});
        })

    useEffect(() => {
        getMemberGroupList({PageNo: currentPage, PageSize: pagination.pageSize})
    }, []);

    const getMemberGroupList = async(params: MemberGroupQueryModel) => {
        setLoading(true);
        await getMemberGroups(params).then(result => {
            setGroups(result);
            setTotal(result.length);
            setLoading(false);
        })
    }

    const handleGroupAdd = () => {
        navigate('add');
    }

    const handleGroupEdit = () => {
        navigate('edit');
    }

    const handleGroupCourseStatus = (data: MemberGroup) => {
        navigate('courseStatus', {state: {...data}});
    }

    return (
        user?.user?.isMemberGroupLeader || user?.user?.isMemberGroupMember ?
        <div className='itemTop'>
        {
            user?.user?.isMemberGroupLeader && 
            <Space className='btttonGroup section_card'>
                <Button disabled={groups.length === 0} type='text' icon={<img src='/assets/images/edit.png' alt='edit' className='icon'/>} onClick={handleGroupEdit}>编辑</Button>
                <Button type='text' icon={<img src='/assets/images/add.png' alt='add' className='icon'/>} onClick={handleGroupAdd}>添加小组</Button>
            </Space>
        }
            
            <List
                loading={loading}
                itemLayout='horizontal'
                dataSource={groups}
                renderItem={item => (
                    <List.Item
                    key={item.memberGroupId}
                    className='listItem'
                    onClick={() => {handleGroupCourseStatus(item)}}
                    actions={[]}>
                        <List.Item.Meta
                        avatar={<Avatar src={item.imagePath} shape='square'/>}
                        title={item.name}
                        description={item.isGroup ? <Space size={15}><span>人数:{item.memberCount}</span><span>课程:{item.courseCount}</span><span>平均进度:{item.completePercent+'%'}</span></Space> 
                        : <Space size={15}><span>课程:{item.courseCount}</span><span>进度:{item.completePercent+'%'}</span></Space>}/>
                    </List.Item>
                )}/>
        </div> : <AuthorizationPage/>
    )
}
