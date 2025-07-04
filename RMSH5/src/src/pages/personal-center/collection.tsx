import React, { useState, useEffect } from 'react';
import { PaginationProps } from 'antd/lib/pagination';
import { List, Avatar, Button, message, Breadcrumb } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { CollectionModel, CollectionQueryModel } from '../../models/personal-center';
import { getCollections } from '../../services/personal-center';
import { paginationConfig } from '../../utilities/pagination';
import { cancelCourseCollection, courseCollection } from '../../services/azure-lessons';
import { CourseCollectionModel } from '../../models/azure-lessons';
import '../../styles/infoCenter.scss';

let isClickCollection = true;
export default function Collection() {
    const [collections, setCollections] = useState<CollectionModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();

    useEffect(() => {
        getCollectionList({PageNo: currentPage, PageSize: pagination.pageSize}, true)
    }, [])

    const pagination : PaginationProps = paginationConfig(
        total, 
        currentPage, 
        (page: number, pageSize?: number) => {
            setCurrentPage(page);
            getCollectionList({PageNo: page, PageSize: pageSize}, true);
        })

    const getCollectionList = async(params: CollectionQueryModel, filterCancel: boolean) => {
        setLoading(true);
        await getCollections(params).then(result => {
            let _result = filterCancel ? result.data.filter(item => !item.isCancel) : result.data;
            setCollections(_result.sort((a,b) => b.courseId > a.courseId ? 1 : -1));
            setTotal(result.total);
            setLoading(false);
        })
    }

    const handleCancelCollection = (e: any, data: CourseCollectionModel) => {
        e.stopPropagation();
        cancelCourseCollection(data).then(result => {
            message.destroy();
            if(result){
                message.success('取消收藏成功');
                let collect : CollectionModel = collections.find(item => item.courseId === data.courseId)!;
                let otherCollects : CollectionModel[] = collections.filter(item => item.courseId !== data.courseId);
                collect.isCancel = true;
                setCollections([...otherCollects, collect].sort((a,b) => b.courseId > a.courseId ? 1 : -1))
            }else{
                message.warn('取消收藏失败，请稍后再试');
            }
        })
    }

    const handleCourseCollection = (e: any, data: CourseCollectionModel) => {
        e.stopPropagation();
        courseCollection(data).then(result => {
            message.destroy();
            if(result){
                message.success('收藏成功');
                let collect : CollectionModel = collections.find(item => item.courseId === data.courseId)!;
                let otherCollects : CollectionModel[] = collections.filter(item => item.courseId !== data.courseId);
                collect.isCancel = false;
                setCollections([...otherCollects, collect].sort((a,b) => b.courseId > a.courseId ? 1 : -1))
            }else{
                message.warn('收藏失败，请稍后再试');
            }
        })
    }

    const handleClickCollection = (e: any, data: CourseCollectionModel, isCollect: boolean) => {
        e.stopPropagation();
        if(isClickCollection){
            isClickCollection = false;
            if(isCollect){
                handleCourseCollection(e, data);
            }else{
                handleCancelCollection(e, data);
            }
            var collectionResult = setTimeout(() => {
                isClickCollection = true;
                clearTimeout(collectionResult);
            }, 5000);
        }else{
            message.destroy();
            message.info('操作频繁，请稍后再试');
        }
    }

    return (
        <>
        <Breadcrumb className='section_card itemTop'>
            <Breadcrumb.Item><Link to='/personalCenter'>个人中心</Link></Breadcrumb.Item>
            <Breadcrumb.Item>我的收藏</Breadcrumb.Item>
        </Breadcrumb>
        <List
        loading={loading}
        itemLayout='horizontal'
        dataSource={collections}
        pagination={pagination}
        renderItem={item => (
            <List.Item
            key={item.id}
            className='listItem line'
            onClick={() => item.categoryRootName === '云课堂' ? navigate(`/azureLessons/${item.courseId}`) : navigate(`/operationGuide/${item.courseId}`)}
            actions={[<Button icon={item.isCancel ? <HeartOutlined onClick={(e) => handleClickCollection(e, {courseId: item.courseId, sectionId: item.sectionID, sectionNodeId: item.sectionNodeID}, true)}/> : <HeartFilled style={{color: '#008CD0'}}/>} type='text' size='small' onClick={(e) => handleClickCollection(e, {courseId: item.courseId, sectionId: item.sectionID, sectionNodeId: item.sectionNodeID}, false)}></Button>]}>
                <List.Item.Meta
                avatar={<Avatar className='itemAvatar' src={item.courseImagePath} shape='square'/>}
                title={item.courseName}
                description={item.description}/>
            </List.Item>
        )}
        />
        </>
    )
}
