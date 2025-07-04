import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Space, Button, Avatar, Modal, message } from 'antd';
import QRCode from 'qrcode.react';
import { getMemberLearningStatus, removeGroupMember, inviteUserToGroup } from '../../services/study-group';
import { getPersonaUserInfo } from '../../services/personal-center';
import { MemberLearningStatusModel } from '../../models/study-group';
import { USER_PROFILE, INITIAL_PATH_SEARCH } from '../../models/common/sys-msg';
import { AuthorizationPage } from '../error-page';
import { TokenModel } from '../../models/login';

export default function StudyGroupMember() {
    const location = useLocation();
    const [members, setMembers] = useState<MemberLearningStatusModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');
    const [inviteUserVisible, setInviteUserVisible] = useState<boolean>(false);
    window.location.search && sessionStorage.setItem(INITIAL_PATH_SEARCH, window.location.search);
    const initialSearch = sessionStorage.getItem(INITIAL_PATH_SEARCH);
    const query = new URLSearchParams(initialSearch ?? '');
    const groupId = query.get('groupId') ?? '';
    const invitedBy = query.get('invitedBy') ?? '';
    const groupName = query.get('name') ?? '';
    const inviteStartTime = Number(query.get('start')) ?? 0;
    const {memberGroupId, name} = location.state ?? {memberGroupId : groupId, name: groupName} ?? { memberGroupId : '', name: ''};
    const navigate = useNavigate();

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
            // 邀请学员进组
            groupId && invitedBy && inviteUserToGroup(groupId, invitedBy).then(result => {
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
                            if(!user?.user?.isMemberGroupLeader && !user?.user?.isMemberGroupMember){ // 非小组成员跳转至首页
                                navigate('/home', {replace: true});
                            }else{
                                navigate('/studyGroups', {replace: true});
                            }
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
            getMembers();
        }
    }, []);

    const getMembers = () => {
        setLoading(true);
        getMemberLearningStatus(memberGroupId).then(result => {
            setMembers(result);
            setLoading(false);
        })
    }

    const handleRemoveMember  = (member: MemberLearningStatusModel) => {
        if(member.userId === user.id){
            Modal.info({
                icon: undefined,
                title: undefined,
                width: 250,
                className: 'textCenter',
                content: '不能移除自己',
            })
        }else{
            Modal.confirm({
                icon: undefined,
                title: undefined,
                width: 250,
                className: 'textCenter',
                content: '确定要移除该学员吗？',
                onOk: () => {
                    removeGroupMember(member.memberGroupId, member.userId).then(result => {
                        message.destroy();
                        if(result){
                            message.success('移除学员成功');
                            getMembers();
                        }else{
                            message.warn('移除学员失败');
                        }
                    })
                }
            })
        }
    }

    const handleInviteUser = () => {
        setInviteUserVisible(true);
    }

    return (
        user?.user?.isMemberGroupLeader ?
        <>
        <div className='title itemTop'>{name}</div>
         <Space className='btttonGroup'>
            <Button type='text' icon={<img src='/assets/images/invite.png' alt='edit' className='icon'/>} onClick={handleInviteUser}>邀请</Button>
        </Space>
        <List
            loading={loading}
            itemLayout='horizontal'
            dataSource={members}
            renderItem={item => (
                <List.Item
                key={item.userId}
                className='listItem'
                actions={[<Button type='text' onClick={() => handleRemoveMember(item)}>移除</Button>]}>
                    <List.Item.Meta
                    avatar={<Avatar src={item.profileImagePath} shape='square'/>}
                    title={item.userName}
                    description={<Space size={15}><span>完成:{item.completeCount}</span><span>未完成:{item.unCompleteCount}</span><span>进度:{item.completePercent+'%'}</span></Space>}/>
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
