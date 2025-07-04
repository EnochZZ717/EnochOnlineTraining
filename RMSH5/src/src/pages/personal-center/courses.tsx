import React, { useState, useEffect } from 'react';
import { List, Avatar, Breadcrumb } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { Link, useNavigate } from 'react-router-dom';
import { CompletedCoursesModel, CompletedCoursesQueryModel } from '../../models/personal-center';
import { getCompletedCourses } from '../../services/personal-center';
import { paginationConfig } from '../../utilities/pagination';
import '../../styles/infoCenter.scss';

export default function Courses() {
    const [courses, setCourses] = useState<CompletedCoursesModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();

    useEffect(() => {
        getCourseList({PageNo: currentPage, PageSize: pagination.pageSize})
    }, [])

    const pagination : PaginationProps = paginationConfig(
        total, 
        currentPage, 
        (page: number, pageSize?: number) => {
            setCurrentPage(page);
            getCourseList({PageNo: page, PageSize: pageSize});
        })

    const getCourseList = async(params: CompletedCoursesQueryModel) => {
        setLoading(true);
        await getCompletedCourses(params).then(result => {
            setCourses(result.data);
            setTotal(result.total);
            setLoading(false);
        })
    }

    return (
        <>
        <Breadcrumb className='section_card itemTop'>
            <Breadcrumb.Item><Link to='/personalCenter'>个人中心</Link></Breadcrumb.Item>
            <Breadcrumb.Item>完成课程</Breadcrumb.Item>
        </Breadcrumb>
        <List
        loading={loading}
        itemLayout='horizontal'
        dataSource={courses}
        pagination={pagination}
        renderItem={item => (
            <List.Item
            onClick={() => item.categoryRootName === '云课堂' ? navigate(`/azureLessons/${item.id}`) : navigate(`/operationGuide/${item.id}`)}
            className='listItem line'
            actions={[item.completedDate]}>
                <List.Item.Meta
                avatar={<Avatar className='itemAvatar' src={item.coverImagePath} shape='square'/>}
                title={item.name}/>
            </List.Item>
        )}
        />
        </>
    )
}
