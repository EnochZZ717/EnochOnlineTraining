import React, { useState, useEffect } from 'react';
import { List, Image, Avatar, Space, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MemberGroup } from '../../models/study-group';
import { getMemberGroups, deleteMemberGroups } from '../../services/study-group';
import { findTargetParentElement } from '../../utilities/elementHelper';
import { USER_PROFILE } from '../../models/common/sys-msg';
import { AuthorizationPage } from '../error-page';

export default function StudyGroupEdit() {
    const [groupLoading, setGroupLoading] = useState<boolean>(false);
    const [groups, setGroups] = useState<MemberGroup[]>([]);
    const navigate = useNavigate();
    const [selectedGroupCount, setSelectedGroupCount] = useState<number>(0);
    const [selectedGroups,] = useState(new Map<string, boolean>());
    const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');

    useEffect(() => {
        setGroupLoading(true);
        getMemberGroups({}).then(result => {
            let group = result.filter(item => item.isGroup);
            setGroups(group);
            group.forEach(item => {
                selectedGroups.set(item.memberGroupId, false);
            });
            setGroupLoading(false);
        })
    }, []);

    const handleGroupClick = (e: any, isAllSelect: boolean, id: string) => {
        let element = findTargetParentElement(e.target, 'group_list');
        if(element){
            let checkImgEle = element.childNodes[0].childNodes[0];
            if(checkImgEle.src.endsWith('/assets/images/checked.png')){
                checkImgEle.src = '/assets/images/wait_check.png';
                if(isAllSelect){
                    for(let i = 0; i < document.getElementsByClassName('enable_check').length; i++){
                        document.getElementsByClassName('enable_check')[i].setAttribute('src', '/assets/images/wait_check.png');
                    };
                    Array.from(selectedGroups.keys()).forEach(item => selectedGroups.set(item, false));
                }else{
                    selectedGroups.set(id, false);
                }
            }else{
                checkImgEle.src = '/assets/images/checked.png';
                if(isAllSelect){
                    for(let i = 0; i < document.getElementsByClassName('enable_check').length; i++){
                        document.getElementsByClassName('enable_check')[i].setAttribute('src', '/assets/images/checked.png');
                    };
                    Array.from(selectedGroups.keys()).forEach(item => selectedGroups.set(item, true));
                }else{
                    selectedGroups.set(id, true);
                }
            }
            setSelectedGroupCount(Array.from(selectedGroups.values()).filter(v => v).length);
        }
    }

    const handleGroupCancel = () => {
        navigate('/studyGroups');
    }

    const handleGroupRemove = () => {
        let selectedGroupIds = Array.from(selectedGroups.entries()).filter(value => value[1]).map(item => {
            return item[0];
        });
        deleteMemberGroups(selectedGroupIds).then(result => {
            message.destroy();
            if(result){
                message.success('学习小组删除成功！');
                navigate('/studyGroups');
            }else{
                message.warn('学习小组删除失败，请稍后再试！');
            }
        });
    }

    return (
        user?.user?.isMemberGroupLeader ?
        (<div className='itemTop'>
            <List
                loading={groupLoading}
                dataSource={groups}
                itemLayout='horizontal'
                renderItem={item => (
                    <List.Item className='group_list' key={item.memberGroupId} onClick={(e) => handleGroupClick(e, false, item.memberGroupId)}>
                        {<Image src='/assets/images/wait_check.png' alt='enable_check' preview={false} className='check enable_check' />}
                        <List.Item.Meta
                            avatar={<Avatar src={item.imagePath} shape='square'/>}
                            title={item.name}
                            description={<Space size={15}><span>人数:{item.memberCount}</span><span>课程:{item.courseCount}</span><span>平均进度:{item.completePercent+'%'}</span></Space>}
                        />
                    </List.Item>
                )}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: 0, alignItems: 'center'}}>
                <Space size={30}>
                    <div className='group_list' onClick={(e) => handleGroupClick(e, true, '')}>
                        <Image src={selectedGroupCount === groups.length ? '/assets/images/checked.png' : '/assets/images/wait_check.png'} preview={false} alt='check_all' className='check'/>
                        <span>全选</span>
                    </div>
                    <div>
                        <span>小组：{selectedGroupCount}</span>
                    </div>
                </Space>
                <Space>
                    <Button type='default' onClick={handleGroupCancel}>取消</Button>
                    <Button type='primary' onClick={handleGroupRemove} disabled={selectedGroupCount === 0}>删除</Button>
                </Space>
            </div>
        </div>) : <AuthorizationPage/>
    )
}
