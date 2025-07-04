import React, { ReactElement, useState, useEffect } from 'react'
import { Carousel, Image, Row, Col, message, List, Avatar, Modal, Affix, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHomeData } from '../../services/home';
import { HomeModel, BannerImageModel, HotCourseQueryModel, HotCourseModel } from '../../models/home';
import { paginationConfig } from '../../utilities/pagination';
import Search from './search';
import { RESPONSIVE_THRESHOLD, USER_PROFILE } from '../../models/common/sys-msg';
import '../../styles/home.scss';

// 首页
export default function Home(props: {forReview?: boolean}): ReactElement {
    const navigate = useNavigate();
    const [homeData, setHomeData] = useState<HomeModel>();
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const isResponsive = window.screen.width < RESPONSIVE_THRESHOLD;
    const location  = useLocation();

    useEffect(() => {
        if(location.state?.isNewUser){
            Modal.info({
                title: undefined,
                icon: undefined,
                content: '蔡司空中课堂是分享创新显微技术知识和应用案例的小程序，为了提供更好的服务，请先前往注册。',
                okText: '前往注册',
                onOk: () => {
                    sessionStorage.removeItem(USER_PROFILE);
                    navigate('/register');
                }
            })
        }
        getHomeDatas({PageNo: currentPage, PageSize: pagination.pageSize});
    }, [])

    const getHomeDatas = async(params: HotCourseQueryModel) => {
        setLoading(true);
        await getHomeData(params).then(result => {
            setHomeData(result);
            setTotal(result.hotCourseCount);
            setLoading(false);
        })
    }

    const pagination : PaginationProps = paginationConfig(
        total, 
        currentPage, 
        (page: number, pageSize?: number) => {
            setCurrentPage(page);
            getHomeDatas({PageNo: page, PageSize: pageSize});
        })

    const handleCourseClick = (item: HotCourseModel) => {
        if(item.isPublished){
            if(item.categoryRootName === '云课堂'){
                navigate(`/azureLessons/${item.id}`)
            }else{
                navigate(`/operationGuide/${item.id}`)
            }
        }else{
            message.destroy();
            message.info("课程尚未发布，尽情期待");
        }
    }

    const handleBannerCourseClick = (item: BannerImageModel) => {
        if(item.isPublished){
            if(item.categoryType === '云课堂'){
                navigate(`/azureLessons/${item.id}`)
            }else{
                navigate(`/operationGuide/${item.id}`)
            }
        }else{
            message.destroy();
            message.info("课程尚未发布，尽情期待");
        }
    }
    
    return (
        props.forReview ? 
        <>
        <Affix offsetTop={0}>
        <Row className='section_card itemTop'>
            <Col span={24}><Input placeholder="搜索课程" allowClear className='banner' addonAfter={<SearchOutlined/>}/></Col>
        </Row>
        </Affix>
        <Row>
        <Col span={24}>
        <Carousel autoplay className='banner section_card'>
            {
                homeData?.bannerImageList?.map((item: BannerImageModel) => {
                    return <Image src={item.imagePath} width='100%' height={isResponsive ? 168 : 278} preview={false} key={item.id}/>
                })
            }
        </Carousel>
        </Col>
        </Row>
        <Row gutter={4} className='typeRow section_card'>
         <Col span = {11} className='typeCol'>
            <Image src={homeData?.secondRowImageList?.find(item => item.categoryType === '云课堂')?.imagePath} width={isResponsive ? 40 : 100} height={isResponsive ? 40 : 100} preview={false}/>
            <div>云课堂</div>
         </Col> 
         <Col span = {2} className='typeSeperateCol'>
             <div className='seperateLine'></div>
         </Col>
         <Col span = {11} className='typeCol'>
            <Image src={homeData?.secondRowImageList?.find(item => item.categoryType !== '云课堂')?.imagePath} width={isResponsive ? 40 : 100} height={isResponsive ? 40 : 100} preview={false}/>
            <div>培训课程</div>
         </Col>  
        </Row>
        <List
        split={true}
        className='home'
        itemLayout={'horizontal'}
        dataSource={homeData?.hotCourseList}
        pagination={pagination}
        loading={loading}
        renderItem={
            item => (
                    <List.Item
                    key={item.id}
                    >
                    <List.Item.Meta
                        avatar={<Avatar alt={item.coverImage.name} style={{width: 104, height: 64}} src={item.coverImage.contentPath} shape='square'/>}
                        title={item.name}
                    />
                    </List.Item> 
            )
        }
        />
        </> 
        :
        <>
        <Affix offsetTop={54}>
        <Row className='section_card itemTop'>
            <Col span={24}><Search isHomeSearch={false}/></Col>
        </Row>
        </Affix>
        <Row>
        <Col span={24}>
        <Carousel autoplay className='banner section_card'>
            {
                homeData?.bannerImageList?.map((item: BannerImageModel) => {
                    return <Image src={item.imagePath} width='100%' height={isResponsive ? 168 : 278} preview={false} key={item.id} onClick={() => {handleBannerCourseClick(item)}}/>
                })
            }
        </Carousel>
        </Col>
        </Row>
        <Row gutter={4} className='typeRow section_card'>
         <Col span = {11} className='typeCol'>
            <Image onClick={() => {navigate(`/azureLessons`)}} src={homeData?.secondRowImageList?.find(item => item.categoryType === '云课堂')?.imagePath} width={isResponsive ? 40 : 100} height={isResponsive ? 40 : 100} preview={false}/>
            <div>云课堂</div>
         </Col> 
         <Col span = {2} className='typeSeperateCol'>
             <div className='seperateLine'></div>
         </Col>
         <Col span = {11} className='typeCol'>
            <Image onClick={() => {navigate(`/operationGuide`)}} src={homeData?.secondRowImageList?.find(item => item.categoryType === '培训课程')?.imagePath} width={isResponsive ? 40 : 100} height={isResponsive ? 40 : 100} preview={false}/>
            <div>培训课程</div>
         </Col>  
        </Row>
        <List
        split={true}
        className='home'
        itemLayout={'horizontal'}
        dataSource={homeData?.hotCourseList}
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
        </>
    )
}
