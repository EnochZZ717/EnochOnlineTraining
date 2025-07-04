import React, { useState, useEffect } from 'react';
import { List, Row, Col, Button, Modal, message, Space, Tag, Avatar, Affix } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { DownOutlined, CheckOutlined, UpOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCourseCategoryConfig, getOperationGuideCourses, getUserSeriesNumber, addUserSeriesNumber } from '../../services/operation-guide';
import { OperationGuideQueryModel, OperationGuideCourseModel } from '../../models/operation-guide';
import { TagConfigModel, SubTagConfigModel } from '../../models/azure-lessons';
import { paginationConfig } from '../../utilities/pagination';
import SeriesNumberGuide from '../login/series-number-guide';
import Search from '../home/search';
import EditableTagGroup from '../login/editable-tag-group';
import '../../styles/azureLessons.scss';
import '../../styles/home.scss';

// 培训课程
export default function OperationGuide() {
    const navigate = useNavigate();
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [courses, setCourses] = useState<OperationGuideCourseModel[]>([]);
    const [isSNModalVisible, setIsSNModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentOrderKey, setCurrentOrderKey] = useState<{key: string, isAsc: boolean}>({key: '', isAsc: false});
    const [selectedTags, ] = useState<Map<string, string>>(new Map());
    const [tags, setTags] = useState<TagConfigModel[]>([]);
    const [sns, setSns] = useState<string[]>([]);
    const [orderHidden, setOrderHidden] = useState<boolean>(true);
    const [courseTagHidden, setCourseTagHidden] = useState<boolean>(true);

    const pagination : PaginationProps = paginationConfig(
        total, 
        currentPage, 
        (page: number, pageSize?: number) => {
            setCurrentPage(page);
            getCourseListByTag({PageNo: page, PageSize: pageSize, SortField: currentOrderKey.key, SortOrder: currentOrderKey.isAsc ? 0 : 1}, Array.from(selectedTags.values()));
        })

    useEffect(() => {
        getCourseCategoryConfig().then(result => {
            setTags(result);
        })

        getUserSeriesNumber().then(result => {
            let usn = result?.toString().trim().split(',').filter(item => item);
            setSns(usn);
        })
    }, []);

    useEffect(() => {
        getCourseListByTag({PageNo: currentPage, PageSize: pagination.pageSize, SortField: currentOrderKey.key, SortOrder: currentOrderKey.isAsc ? 0 : 1}, []);
    }, [currentOrderKey])

    const getCourseListByTag = async(params: OperationGuideQueryModel, tagList: string[]) => {
        setLoading(true);
        await getOperationGuideCourses(params, tagList).then(result => {
            setCourses(result.data);
            setTotal(result.total);
            setLoading(false);
        })
    }

    const showSNModal = () => {
        setIsSNModalVisible(true);
    };

    const handleSNCancel = () => {
        setIsSNModalVisible(false);
        getCourseListByTag({PageNo: currentPage, PageSize: pagination.pageSize, SortField: currentOrderKey.key, SortOrder: currentOrderKey.isAsc ? 0 : 1}, []);
    };

    const handleCourseClick = (item: OperationGuideCourseModel) => {
        if(item.isPublished){
            navigate(`${item.id}`)
        }else{
            message.destroy();
            message.info("课程尚未发布，尽情期待");
        }
    }

    const handleOrderClick = (e: any) => {
        setCurrentOrderKey({key: e.target.id, isAsc: !currentOrderKey.isAsc});
        setOrderHidden(true);
    }

    const handleTagClick = (e: any) => {
        e.stopPropagation();
        let tagKey = e.target.innerText;
        if(selectedTags.has(tagKey)){
            selectedTags.delete(tagKey);
            e.target.style.background = '#F6F6F6';
            e.target.style.color = '#7F7F7F';
        }else{
            handleResetTag(e, false);
            let tagValue = tags.map(item => item.subNames.find(subItem => subItem.name === tagKey)).find(item => item)!.id;
            selectedTags.set(tagKey, tagValue);
            e.target.style.background = 'rgba(53,152,229,0.11)';
            e.target.style.color = '#666666';
        }
    }

    const handleResetTag = (e: any, tagHidden: boolean = true) => {
        e.stopPropagation();
        if(selectedTags.size > 0){
            selectedTags.clear();
            let tagElements = document.querySelectorAll('.typeTag') as NodeListOf<HTMLElement>;
            for(let i = 0; i < tagElements.length; i++){
                tagElements[i].style.backgroundColor = '#F6F6F6';
                tagElements[i].style.color = '#7F7F7F'
            };
            tagHidden && getCourseListByTag({PageNo: currentPage, PageSize: pagination.pageSize}, Array.from(selectedTags.values()));
        }
        setCourseTagHidden(tagHidden);
    }

    const handleTagSubmit = () => {
        getCourseListByTag({PageNo: currentPage, PageSize: pagination.pageSize}, Array.from(selectedTags.values()));
        setCourseTagHidden(true);
    }

    const handleClickOrder = (e: any, flag: boolean = true) => {
        e.stopPropagation();
        setCourseTagHidden(true);
        if(!flag){
            setOrderHidden(!orderHidden); 
        }else{
            if(!orderHidden){
                setOrderHidden(true);
            }
        }
    }

    const handleClickCourseTag = (e: any, flag: boolean = true) => {
        e.stopPropagation();
        setOrderHidden(true);
        if(!flag){
            setCourseTagHidden(!courseTagHidden); 
        }else{
            if(!courseTagHidden){
                setCourseTagHidden(true); 
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickCourseTag)
        document.addEventListener('click', handleClickOrder)
        return () => {
            document.removeEventListener('click', handleClickCourseTag);
            document.removeEventListener('click', handleClickOrder);
        }
    },[courseTagHidden, orderHidden])

    const handleSNCallBack = (value: string[]) => {
        setSns(value);
    }

    return (
        <>
        <Affix offsetTop={54}>
        <div className='header itemTop'>
            <Row>
                <Col span={24}><Search isHomeSearch={false}/></Col>
            </Row>
            <Row>
                <Col span={20} className='sntip'>
                {`输入${sns.length > 0 ? '其它' : ''}产品设备序列号(SN)解锁相关课程`}
                </Col>
                <Col className='snButton' span={4}>
                    <Button type="primary" size='small' onClick={showSNModal} disabled={loading}>解锁</Button>
                </Col>
            </Row>
            <div className='cardRow'>
                <div className='long' onClick={(e) => handleClickOrder(e, false)}>排序&nbsp;{orderHidden ? <DownOutlined /> : <UpOutlined/>}</div>
                <div className='short'>
                    <div className='seperate'></div>
                </div>
                <div className='long' onClick={(e) => handleClickCourseTag(e, false)}>课程&nbsp;{courseTagHidden ? <DownOutlined /> : <UpOutlined/>}</div>
                <div className='tagCard top' hidden={orderHidden} onClick={(e) => {e.stopPropagation();}}>
                    <div className='item border' onClick={handleOrderClick} id='ModifiedDate'>
                        <div>时间</div>
                        {currentOrderKey.key === 'ModifiedDate' && <div><CheckOutlined /></div>}
                    </div>
                    <div className='item' id='hits' onClick={handleOrderClick}>
                        <div>热度</div>
                        {currentOrderKey.key === 'hits' && <div><CheckOutlined /></div>}
                    </div>
                </div>
                <div className='tagCard top' hidden={courseTagHidden} onClick={(e) => {e.stopPropagation();}}>
                <div className='tagCardItem'>
                {
                    tags.map((item: TagConfigModel) => {
                        return (<div key={item.name}>
                            <div>{item.name}</div>
                            <div>
                            {item.subNames.map((subItem: SubTagConfigModel) => {
                                return <Tag key={subItem.id} onClick={handleTagClick} className='typeTag'>{subItem.name}</Tag>
                            })}
                            </div>
                            </div>)
                    })
                }
                </div>
                <div className='tagCardbutton'>
                    <Space>
                        <Button size='small' onClick={handleResetTag}>重置</Button>
                        <Button size='small' style={{backgroundColor: '#008BD0', color: '#fff'}} onClick={handleTagSubmit}>确定</Button>
                    </Space>
                </div>
                </div>
            </div>
            <Modal 
                title={<SeriesNumberGuide/>}
                visible={isSNModalVisible} 
                onCancel={handleSNCancel}
                destroyOnClose
                footer={[]}
                >
                    <EditableTagGroup datas={sns} callback={handleSNCallBack} needToDB={true}/>
            </Modal>
        </div>
        </Affix>
        {
            <List
            split={false}
            itemLayout='horizontal'
            dataSource={courses}
            pagination={pagination}
            loading={loading}
            renderItem={
                item => (
                        <List.Item
                        key={item.id}
                        onClick={() => {handleCourseClick(item)}}
                        >
                        <List.Item.Meta
                            avatar={<Avatar alt={item.coverImage.name} style={{width: 104, height: 64}} src={item.coverImage.contentPath} shape='square'/>}
                            title={item.name}
                        />
                        </List.Item>
                )
            }
            />
        }
        </>
    )
}
