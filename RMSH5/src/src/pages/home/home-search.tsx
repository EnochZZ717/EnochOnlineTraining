import React, { useEffect, useState } from 'react';
import { List, message, Avatar, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllCoursesByHomeSearch } from '../../services/home';
import { CoursePublicModel } from '../../models/azure-lessons';
import { CourseTypeModel, HomeSearchQueryModel } from '../../models/home';
import Search from './search';
import '../../styles/home.scss';

export default function HomeSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const [courses, setCourses]  = useState<CourseTypeModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(location.state);

    useEffect(() => {
        getCourseList({searchStr: search});
    }, [search])

    const getCourseList = async(query: HomeSearchQueryModel) => {
        setLoading(true);
        await getAllCoursesByHomeSearch(query).then(result => {
            setCourses(result);
            setLoading(false);
        })
    }

    const handleSearch = (e: any) => {
        setSearch(e);
    }

    const handleCourseClick = (item: CoursePublicModel) => {
        if(item?.isPublished){
            navigate(`${item.categoryRootName === "云课堂" ? "/azureLessons/" : "/operationGuide/"}${item.id}`)
        }else{
            message.destroy();
            message.info("课程尚未发布，尽情期待");
        }
    }

    return (
        <div>
            <div className='section_card itemTop'>
                <Search isHomeSearch={true} callBack={handleSearch}/>
            </div>
            {
                loading ? <div className='nodata'><Spin/></div> :
            <>
            {(!courses || (courses?.publicCourses?.length === 0 && courses?.opeartionCourses?.length === 0 && courses?.currentMemberGroupCourses?.length === 0)) && <div className='nodata'>没有找到相应的课程</div>}
            {courses && courses?.publicCourses?.length !== 0 && <><div className='title'>云课堂</div>
            <List
            split={false}
            itemLayout='horizontal'
            dataSource={courses?.publicCourses}
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
            /></>}
            {courses && courses?.opeartionCourses?.length !== 0 && <><div className='title'>培训课程</div>
            <List
            split={false}
            itemLayout='horizontal'
            dataSource={courses?.opeartionCourses}
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
            /></>}
            {courses && courses?.currentMemberGroupCourses?.length !== 0 && <><div className='title'>学习小组</div>
            <List
            split={false}
            itemLayout='horizontal'
            dataSource={courses?.currentMemberGroupCourses}
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
            /></>}
            </>
            }
        </div>
    )
}
