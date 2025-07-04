import React, { useEffect, useState } from 'react';
import { Form, Select, Image, Input, Button, Modal, List, Avatar, Space, message, Spin } from 'antd';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { getGroupImages, getGroupManagedCourses, addMemberGroup, getMemberGroupDetail, editMemberGroup } from '../../services/study-group';
import { GroupImage, GroupCourseModel, GroupRequestModel } from '../../models/study-group';
import { findTargetParentElement } from '../../utilities/elementHelper';
import { RESPONSIVE_THRESHOLD } from '../../models/common/sys-msg';
import LessonDetail from '../azure-lessons/lesson-detail';
import { USER_PROFILE } from '../../models/common/sys-msg';
import { AuthorizationPage } from '../error-page';
import '../../styles/studyGroup.scss';
import '../../styles/login.scss';

export default function StudyGroupAdd() {
    const [form] = Form.useForm();
    const [groupImages, setGroupImages] = useState<GroupImage[]>([]);
    const [isCourseModalVisible, setIsCourseModalVisible] = useState<boolean>(false);
    const [groupCourses, setGroupCourses] = useState<GroupCourseModel[]>([]);
    const [managedCourseLoading, setManagedCourseLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [selectedCourses,] = useState(new Map<string, boolean>());
    const [selectedCourseCount, setSelectedCourseCount] = useState<number>(0);
    const [selectedCoursesForm, setSelectedCoursesForm] = useState<GroupCourseModel[]>([]);
    const location  = useLocation();
    const isResponsive = window.screen.width < RESPONSIVE_THRESHOLD;
    const [isCourseDetailModalVisible, setIsCourseDetailModalVisible] = useState<boolean>(false);
    const [detailCourse, setDetailCourse] = useState<{id: string, type: string}>();
    const [, setSearch] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');

    useEffect(() => {
        getGroupImages().then(result => {
            setGroupImages(result);
        });
        getGroupManagedCourses().then(result => {
            result.forEach(item => {
                selectedCourses.set(item.id, item.isSelected);
            });
            setSelectedCourseCount(Array.from(selectedCourses.values()).filter(v => v).length);
            if(!location.state){
                setGroupCourses(result);
                setSelectedCoursesForm(result.filter(item => item.isSelected));
            }
        });
        if(location.state){
            setLoading(true);
            getMemberGroupDetail(location.state.memberGroupId).then(result => {
                form.setFieldsValue({
                    imageLibraryId: result.imageId,
                    name: result.name
                });
                setSelectedCoursesForm(result.groupMangedCourses?.filter(item => item.isSelected));
                setGroupCourses(result.groupMangedCourses);
                setLoading(false);
            })
        }
    }, []);

    const handleGroupCourseAdd = () => {
        setIsCourseModalVisible(true);
        setManagedCourseLoading(true);
        selectedCoursesForm.forEach(item => {
            selectedCourses.set(item.id, true);
        });
        setSelectedCourseCount(selectedCoursesForm.length);
        setManagedCourseLoading(false);
    }

    const handleCourseOk = () => {
        setIsCourseModalVisible(false);
        setSelectedCoursesForm(groupCourses.filter(item => Array.from(selectedCourses.entries()).filter(v => v[1]).map(item => item[0]).includes(item.id)));
    }

    const handleCourseCancel = () => {
        setIsCourseModalVisible(false);
    }

    const handleCourseClick = (e: any, isAllSelect: boolean, id: string) => {
        let element = findTargetParentElement(e.target, 'course_list');
        if(element){
            let checkImgEle = element.childNodes[0].childNodes[0];
            if(checkImgEle.src.endsWith('/assets/images/checked.png')){
                checkImgEle.src = '/assets/images/wait_check.png';
                if(isAllSelect){
                    for(let i = 0; i < document.getElementsByClassName('enable_check').length; i++){
                        document.getElementsByClassName('enable_check')[i].setAttribute('src', '/assets/images/wait_check.png');
                    };
                    Array.from(selectedCourses.keys()).forEach(item => selectedCourses.set(item, false));
                }else{
                    selectedCourses.set(id, false);
                }
                setSelectedCourseCount(Array.from(selectedCourses.values()).filter(v => v).length);
            }else if(checkImgEle.src.endsWith('/assets/images/wait_check.png')){
                checkImgEle.src = '/assets/images/checked.png';
                if(isAllSelect){
                    for(let i = 0; i < document.getElementsByClassName('enable_check').length; i++){
                        document.getElementsByClassName('enable_check')[i].setAttribute('src', '/assets/images/checked.png');
                    };
                    Array.from(selectedCourses.keys()).forEach(item => selectedCourses.set(item, true));
                }else{
                    selectedCourses.set(id, true);
                }
                setSelectedCourseCount(Array.from(selectedCourses.values()).filter(v => v).length);
            }
        }
    }

    const handleAddGroup = (values: any) => {
        setSaveLoading(true);
        message.destroy();
        if(selectedCoursesForm.length <= 0){
            message.warn('未添加课程');
            setSaveLoading(false);
        }else{
            setSaveLoading(false);
        }
        selectedCoursesForm.length > 0 && form.validateFields().then((formdata: any) => {
            setSaveLoading(true);
            let courses = selectedCoursesForm.map((item, index) => {
                return {courseId: item.id, sequence: index}
            })
            let request : GroupRequestModel = {
                ...formdata,
                memberGroupSelectdCourses: courses,
                name: formdata.name?.trim()
            };
            if(location.state){
                editMemberGroup({...request, id: location.state.memberGroupId}).then(result => {
                    if(result){
                        message.success('更新学习小组成功');
                        navigate('/studyGroups/courseStatus', {state: {memberGroupId: location.state.memberGroupId, name: request.name}});
                    }else{
                        message.warn('更新学习小组失败，请稍后再试')
                    }
                    setSaveLoading(false);
                })
            }else{
                addMemberGroup(request).then(result => {
                    if(result){
                        message.success('创建学习小组成功');
                        navigate('/studyGroups');
                    }else{
                        message.warn('创建学习小组失败，请稍后再试')
                    }
                    setSaveLoading(false);
                })
            }
        })
    }

    const handleRemoveCourseForm = (id: string) => {
        // 移除表单中的课程
        setSelectedCoursesForm(selectedCoursesForm.filter(item => item.id !== id));
        setSelectedCourseCount(selectedCoursesForm.filter(item => item.id !== id).length)
        // 将课程列表中的课程的isSelected标为false
        let newGroupCourse = groupCourses.map(item => {
            if(item.id === id){
                item.isSelected = false;
            }
            return item;
        })
        setGroupCourses(newGroupCourse);
        selectedCourses.set(id, false);
    }

    const SortableItem = SortableElement(({value}: any) => (
        <li key={value.id} tabIndex={0} style={{marginTop:16, marginBottom: 16, marginLeft: 0, marginRight: 0, display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', maxWidth: 300}}>
                <img src={value.imagePath} alt={value.name} width={84} height={64}/>
                <div className='itemTitle' style={{width: isResponsive ? 170 : '100%'}}>
                    {value.name}
                </div>
            </div>
            <div>
                {
                    isResponsive ? 
                    <div>
                        <div className='textBtn' onClick={() => {}}>长按排序</div>
                        <button className='textBtn' onClick={() => {handleRemoveCourseForm(value.id)}}>删除</button>
                    </div> :
                    <Space size={15}>
                    <div className='textBtn' onClick={() => {}}>长按排序</div>
                    <button className='textBtn' onClick={() => {handleRemoveCourseForm(value.id)}}>删除</button>
                    </Space>
                }
                
            </div>
        </li>
      ));

    const SortableList = SortableContainer(({items}: any) => {
        return (
          <ul style={{listStyle: 'none', padding: 0}}>
            {items.map((item: GroupCourseModel, index: number) => (
              <SortableItem key={item.id} index={index} value={{...item}} />
            ))}
          </ul>
        );
      });

    const onSortEnd = (orderInfo: any) => {
        setSelectedCoursesForm(arrayMoveImmutable(selectedCoursesForm, orderInfo.oldIndex, orderInfo.newIndex))
    }

    const handleCheckCourseDetail = (e: any, item: GroupCourseModel) => {
        e.stopPropagation();
        setDetailCourse({id: item.id, type: item.categoryRootName});
        setIsCourseDetailModalVisible(true);
    }

    const handleCloseCourseDetail = () => {
        setSearch({});
        setIsCourseDetailModalVisible(false)
    }

    const handlePressEnterGroupName = (e: any) => {
        e.preventDefault();
    }

    return (
        user?.user?.isMemberGroupLeader ?
        (loading ? <div className='nodata'><Spin/></div> :
        <div className='itemTop main_view'>
            <Form
            form={form}
            name='addGroup'
            layout='horizontal'
            labelCol={{span: 12}}
            wrapperCol={{span: 12}}
            >
                <Form.Item name='imageLibraryId' label='头像' rules={[{ required: true, message: '请选择头像' }]}>
                    <Select bordered={false}>
                        {
                            groupImages.map((item: GroupImage) => {
                                return <Select.Option key={item.id} value={item.id}><img src={item.contentPath} width={30}/></Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='name' label='小组名称' rules={[{ required: true, message: '请输入小组名称' }, {whitespace: true}]}>
                    <Input onPressEnter={handlePressEnterGroupName} bordered={false}/>
                </Form.Item>
                <div className='btttonGroup'>
                    <Button type='text' icon={<img src='/assets/images/add.png' alt='add' className='icon'/>} onClick={handleGroupCourseAdd}>添加课程</Button>
                </div>
                <SortableList items={selectedCoursesForm} onSortEnd={onSortEnd}/>
                <Button type='primary' onClick={handleAddGroup} loading={saveLoading}>保存</Button>
            </Form>
            <Modal
                title='添加课程' 
                visible={isCourseModalVisible} 
                width={800}
                closable={true}
                onCancel={handleCourseCancel}
                destroyOnClose
                footer={[
                    <div key='footer' style={{display: 'flex', justifyContent: 'space-between', marginLeft: 8, alignItems: 'center'}}>
                        <Space size={30}>
                            <div className='course_list' onClick={(e) => handleCourseClick(e, true, '')}>
                                <Image src={selectedCourseCount === groupCourses.length ? '/assets/images/checked.png' : '/assets/images/wait_check.png'} preview={false} alt='check_all' className='check'/>
                                <span>全选</span>
                            </div>
                            <div>
                                <span>课程：{selectedCourseCount}</span>
                            </div>
                        </Space>
                        <Space>
                            <Button type='default' onClick={handleCourseCancel}>取消</Button>
                            <Button type='primary' onClick={handleCourseOk}>保存</Button>
                        </Space>
                    </div>
                ]}>
                    <>
                    <List
                        loading={managedCourseLoading}
                        dataSource={groupCourses}
                        itemLayout='horizontal'
                        className='listcourse line'
                        renderItem={item => (
                            <List.Item className='course_list' key={item.id} onClick={(e) => handleCourseClick(e, false, item.id)} actions={[<Button type='text' onClick={(e) => handleCheckCourseDetail(e, item)}>详情</Button>]}>
                                {item.isSelected ? 
                                <Image src='/assets/images/disabled_check.png' alt='disable_check' preview={false} className='check'/> 
                                : selectedCoursesForm.find(_item => _item.id === item.id) ?  
                                <Image src='/assets/images/checked.png' alt='enable_check' preview={false} className='check enable_check'/>
                                : <Image src='/assets/images/wait_check.png' alt='enable_check' preview={false} className='check enable_check'/>}
                                <List.Item.Meta
                                    avatar={<Avatar style={{width: 82, height: 51}} src={item.imagePath} shape='square'/>}
                                    title={item.name}
                                />
                            </List.Item>
                        )}
                    />
                    </>
            </Modal>
            <Modal
            title='课程详情'
            onCancel={handleCloseCourseDetail} 
            onOk={handleCloseCourseDetail}
            visible={isCourseDetailModalVisible}
            destroyOnClose
            >
                <LessonDetail id={detailCourse?.id} type={detailCourse?.type}/>
            </Modal>
        </div>) : <AuthorizationPage/>
    )
}
