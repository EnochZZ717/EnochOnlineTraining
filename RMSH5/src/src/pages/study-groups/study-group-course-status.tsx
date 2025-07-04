import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Avatar, Space, Button, Modal } from 'antd';
import QRCode from 'qrcode.react';
import { MemberGroupCourseStatusModel } from '../../models/study-group';
import { getMemberGroupCourseStatus, inviteUserToGroup } from '../../services/study-group';
import { getPersonaUserInfo } from '../../services/personal-center';
import { USER_PROFILE, INITIAL_PATH_SEARCH } from '../../models/common/sys-msg';
import { AuthorizationPage } from '../error-page';
import { TokenModel } from '../../models/login';

export default function StudyGroupCourseStatus() {
    const location = useLocation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<MemberGroupCourseStatusModel[]>([]);
    const [coursesLoading, setCoursesLoading] = useState<boolean>(false);
    const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');
    const [inviteUserVisible, setInviteUserVisible] = useState<boolean>(false);
    window.location.search && sessionStorage.setItem(INITIAL_PATH_SEARCH, window.location.search);
    const initialSearch = sessionStorage.getItem(INITIAL_PATH_SEARCH);
    const query = new URLSearchParams(initialSearch ?? '');
    const groupId = query.get('groupId') ?? '';
    const invitedBy = query.get('invitedBy') ?? '';
    const groupName = query.get('name') ?? '';
    const inviteStartTime = Number(query.get('start')) ?? 0;
    const {memberGroupId, name, isGroup} = location.state ?? {memberGroupId : groupId, name: groupName, isGroup: false} ?? { memberGroupId : '', name: '', isGroup: false};

    useEffect(() => {
        if(initialSearch){
            let isExpriedInvited = inviteStartTime + 1000*60*60*24*3 < new Date().getTime(); // 3天有效期
            // 邀请学员进组
            if(isExpriedInvited){
                Modal.warn({
                    icon: undefined,
                    title: undefined,
                    width: 250,
                    className: 'textCenter',
                    content: `该邀请已过期，请联系组长`,
                    onOk: () => {
                        sessionStorage.removeItem(INITIAL_PATH_SEARCH);
                        if(!user?.user?.isMemberGroupLeader && !user?.user?.isMemberGroupMember){ // 非小组成员跳转至首页
                            navigate('/home', {replace: true});
                        }else{
                            navigate('/studyGroups', {replace: true});
                        }
                    },
                })
            }
            groupId && invitedBy && !isExpriedInvited && inviteUserToGroup(groupId, invitedBy).then(result => {
                if(result === -1){
                    Modal.info({
                        icon: undefined,
                        title: undefined,
                        width: 250,
                        className: 'textCenter',
                        content: `您已经是${groupName}学习小组成员，请勿重复加入`,
                        onOk: () => {
                            sessionStorage.removeItem(INITIAL_PATH_SEARCH);
                            navigate('/studyGroups/courseStatus', {state: {memberGroupId : groupId, name: groupName}, replace: true});
                            window.location.reload();
                        },
                    })
                }else if(result === -2){
                    Modal.info({
                        icon: undefined,
                        title: undefined,
                        width: 250,
                        className: 'textCenter',
                        content: `${name}学习小组不存在`,
                        onOk: () => {
                            sessionStorage.removeItem(INITIAL_PATH_SEARCH);
                            if(!user?.user?.isMemberGroupLeader && !user?.user?.isMemberGroupMember){ // 非小组成员跳转至首页
                                navigate('/home', {replace: true});
                            }else{
                                navigate('/studyGroups', {replace: true});
                            }
                        },
                    })
                }else if(result === 0){
                    Modal.info({
                        icon: undefined,
                        title: undefined,
                        width: 250,
                        className: 'textCenter',
                        content: `加入${name}学习小组失败， 请稍后再试`,
                        onOk: () => {
                            sessionStorage.removeItem(INITIAL_PATH_SEARCH);
                            navigate('/studyGroups', {replace: true});
                        },
                    })
                }else{
                    Modal.info({
                        icon: undefined,
                        title: undefined,
                        width: 250,
                        className: 'textCenter',
                        content: `您已经加入${name}学习小组`,
                        onOk: () => {
                            if(!user?.user?.isMemberGroupLeader && !user?.user?.isMemberGroupMember){
                                // 刷新用户信息
                                getPersonaUserInfo().then(userInfo => {
                                    let tokenModel : TokenModel = {
                                        ...user,
                                        user: userInfo
                                    }
                                    sessionStorage.setItem(USER_PROFILE, JSON.stringify(tokenModel));
                                    sessionStorage.removeItem(INITIAL_PATH_SEARCH);
                                    navigate('/studyGroups/courseStatus', {state: {memberGroupId : groupId, name: groupName}, replace: true});
                                    window.location.reload();
                                });
                            }else{
                                sessionStorage.removeItem(INITIAL_PATH_SEARCH);
                                navigate('/studyGroups/courseStatus', {state: {memberGroupId : groupId, name: groupName}, replace: true});
                                window.location.reload();
                            }
                        },
                    })
                }
            })
        }else{
            setCoursesLoading(true);
            getMemberGroupCourseStatus(memberGroupId).then(result => {
                setCourses(result);
                setCoursesLoading(false);
            });
        }
    }, []);

    const handleGroupEdit = () => {
        navigate('/studyGroups/update', {state: location.state});
    }

    const handleMember = () => {
        navigate('member', {state: {memberGroupId: memberGroupId, name: name}})
    }

    const handleInviteUser = () => {
        setInviteUserVisible(true);
    }

    return (
        user?.user?.isMemberGroupLeader || user?.user?.isMemberGroupMember ?
        <>
            <div className='title itemTop'>{name}</div>
            {user?.user?.isMemberGroupLeader && isGroup && <Space className='btttonGroup section_card'>
                <Button type='text' icon={<img src='/assets/images/edit.png' alt='edit' className='icon'/>} onClick={handleGroupEdit}>编辑</Button>
                <Button type='text' icon={<img src='/assets/images/user.png' alt='member' className='icon'/>} onClick={handleMember}>学员</Button>
                <Button type='text' icon={<img src='/assets/images/invite.png' alt='invite' className='icon'/>} onClick={handleInviteUser}>邀请</Button>
            </Space>}
            <List
            loading={coursesLoading}
            itemLayout='horizontal'
            dataSource={courses}
            className='line'
            renderItem={item => (
                <List.Item
                key={item.courseId}
                className='listItem'
                onClick={() => item.categoryRootName === '云课堂' ? navigate(`/azureLessons/${item.courseId}`) : navigate(`/operationGuide/${item.courseId}`)}
                actions={[item.courseStatus]}>
                    <List.Item.Meta
                    avatar={<Avatar className='itemAvatar' src={item.contentPath} shape='square'/>}
                    title={item.name}
                    />
                </List.Item>
            )}/>
            <Modal
            width={176}
            title='邀请学员'
            visible={inviteUserVisible}
            closable={false}
            footer={[<Button type='default' size='small' onClick={() => {setInviteUserVisible(false)}}>取消</Button>]}
            >
                <QRCode value={`${window.location.href}?groupId=${memberGroupId}&invitedBy=${user?.user?.id}&name=${name}&start=${new Date().getTime()}`} />
            </Modal>
        </> : <AuthorizationPage/>
    )
}
