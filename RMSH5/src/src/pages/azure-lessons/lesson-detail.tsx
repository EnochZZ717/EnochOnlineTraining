import React, { useState, useEffect, useRef } from 'react';
import { HeartFilled, HeartOutlined, ShareAltOutlined, PlayCircleOutlined, PauseCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, List, Space, Typography, Affix, message, Modal, Spin } from 'antd';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { getCourseDetail, courseCollection, cancelCourseCollection, recordCourseHistory, recordCourseLog, recordWatchCompleted } from '../../services/azure-lessons';
import { getVideoToken } from '../../services/home';
import { CourseCollectionModel, CourseDetailModel, CourseHistoryModel, CourseSectionModel, SectionNodeModel } from '../../models/azure-lessons';
import { VideoStatus } from '../../models/video';
import { getFormatTime } from '../../utilities/timeConvert';
import { HttpStatusCode } from '../../models/common/http-status-code';
import { BrokenPage, ForbiddenPage } from '../error-page';
import { RESPONSIVE_THRESHOLD } from '../../models/common/sys-msg';
import '../../styles/azureLessons.scss';

let timer : any = null;
let isClickCollection = true;
export default function LessonDetail(props: {id?: string, type?: string}) {
    const [collected, setCollect] = useState<boolean>(false);
    const [courseDetail, setCourseDetail] = useState<CourseDetailModel>();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useSearchParams();
    const isOperationGuide = location.pathname.toLocaleLowerCase().includes('operationguide') || props.type === '培训课程';
    const [currentSection, setCurrentSection] = useState<string | undefined>(undefined);
    const [options, setOptions] = useState<{src: string, type: string, protectionInfo: {type: string, authenticationToken: string}[]}>();
    const params = useParams();
    const [videoStatus, setVideoStatus] = useState<VideoStatus>(VideoStatus.init);
    const [videoRecord, setVideoRecord] = useState<Map<string, boolean>>(new Map());
    let currentSearch = search.get('p');
    const [shareCodeVisible, setShareCodeVisible] = useState<boolean>(false);
    const [isForbidden, setIsForbidden] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const isResponsive = window.screen.width < RESPONSIVE_THRESHOLD;
    const [isBroken, setIsBroken] = useState<boolean>(false);

    const collectLessonHandle = async() => {
        if(isClickCollection){
            isClickCollection = false;
            let data : CourseCollectionModel = {
                courseId: courseDetail?.id,
                sectionId: isOperationGuide ? currentSection : courseDetail?.sections[0].id,
                sectionNodeId: !isOperationGuide ? currentSection : undefined
            }
            if(collected){
                cancelCourseCollection(data).then(result => {
                    message.destroy();
                    if(result){
                        message.success('取消收藏成功');
                        setCollect(false);
                    }else{
                        message.warn('取消收藏失败，请稍后再试');
                    }
                })
            }else{
                courseCollection(data).then(result => {
                    message.destroy();
                    if(result){
                        message.success('收藏成功');
                        setCollect(true);
                    }else{
                        message.warn('收藏失败，请稍后再试');
                    }
                })
            }
            var clickCollectionResult = setTimeout(() => {
                isClickCollection = true;
                clearTimeout(clickCollectionResult)
            }, 5000)
        }else{
            message.destroy();
            message.info('操作频繁，请稍后再试');
        }
    }

    const shareLessonHandle = async() => {
        setShareCodeVisible(true);
    }

    // 云课堂视频跳转
    const handleChapterChange = async(id: string, startNumber: number) => {
        if(currentSection === id){
            if(videoStatus !== VideoStatus.pause){
                playerRef.current?.pause();
            }else{
                playerRef.current?.play();
            }
        }else{
            navigate(`?p=${id}`, {replace: true});
            const player = playerRef.current;
            player?.currentTime(startNumber);
            player?.play();
            setCurrentSection(id);
        }
    }

    // 培训课程视频跳转
    const handleSectionChange = (id: string) => {
        if(currentSection === id){
            if(videoStatus === VideoStatus.play){
                playerRef.current?.pause();
            }else{
                playerRef.current?.play();
            }
        }else{
            navigate(`?p=${id}`, {replace: true});
            setCurrentSection(id);
            handleVideoToken(id);
        }
    }

    const handleStartExam = () => {
        let falseValue = Array.from(videoRecord.values()).filter(item => item === false);
        if(falseValue.length > 0){
            message.destroy();
            message.info('看完所有视频可以开始考试');
        }else{
            navigate(`exam`);
        }
    }

    useEffect(() => {
        setLoading(true);
        let id = params?.id || props.id
        id && getCourseDetail(id).then(result => {
            setLoading(false);
            if(result === HttpStatusCode.Forbidden){
                setIsForbidden(true);
            }else{
                setCourseDetail(result);
                handleVideoToken(result?.sections[0]?.id);
                setCollect(result.isFavor);
                let videoRecordMap = new Map();
                if(!isOperationGuide){
                    result.sections[0].nodes.forEach((item: SectionNodeModel ) => {
                        videoRecordMap.set(item.id, item.isCompleted);
                    })
                    
                    if(currentSearch){
                        setCurrentSection(currentSearch);
                    }else{
                        setSearch({p: result.sections[0].nodes[0]?.id}, {replace: true});
                        setCurrentSection(result.sections[0].nodes[0]?.id)
                    }
                }else{
                    result.sections.forEach((item: CourseSectionModel ) => {
                        videoRecordMap.set(item.id, item.isCompleted);
                    })
                    if(currentSearch){
                        setCurrentSection(currentSearch);
                    }else{
                        setSearch({p: result.sections[0].id}, {replace: true})
                        setCurrentSection(result.sections[0].id);
                    }
                }
                setVideoRecord(videoRecordMap);
            }
        })
    }, []);

    useEffect(() => {
        params.id && recordCourseLog(params.id);
    }, []);

    const handleVideoToken = (id: string) => {
        getVideoToken(id).then(token => {
            if(token){
                setOptions({src: token.contentPath, type: 'application/vnd.ms-sstr+xml', protectionInfo: [{type: "AES", authenticationToken: token.token}]})// application/vnd.ms-sstr+xml
            }else{
                setIsBroken(true);
            }
        })
    }

    const videoRef = useRef(null);
    const playerRef = useRef<amp.Player>();

    useEffect(() => {
    //make sure Video.js player is only initialized once
        if(options){
            if (!playerRef.current) {
                const videoElement = videoRef.current;
                if (!videoElement) return;
            
                var playerOptions = {
                    autoplay: true,
                    controls: true,
                    height: 300,
                    logo: {enabled: false}
                };
            
                playerRef.current = amp(videoElement, playerOptions)
                }
        }

        const player = playerRef.current;
        if(player){
            player.addEventListener('ended', () => {
                setVideoStatus(VideoStatus.ended);
                if(isOperationGuide){
                    let data : CourseHistoryModel = {
                        courseId: courseDetail?.id,
                        sectionId: currentSection,
                        sectionNodeId: undefined,
                        watchedTime: player.currentTime(),
                        isCompleted: true
                    }
                    recordCourseHistory(data);
                    videoRecord.set(currentSection!, true);
                    setVideoRecord(videoRecord);
                    handleWatchCompleted();
                    
                    // 跳转至下一章节
                    let currentVideoSequence = courseDetail?.sections.find(item => item.id === currentSection)?.sequence ?? 0;
                    let nextSection = courseDetail?.sections.find(item => item.sequence === currentVideoSequence + 1);
                    if(nextSection){
                        setSearch({p: nextSection.id}, {replace: true});
                        setCurrentSection(nextSection.id);
                        handleVideoToken(nextSection.id);
                    }
                }else{
                    let data : CourseHistoryModel = {
                        courseId: courseDetail?.id,
                        sectionId: courseDetail?.sections[0].id,
                        sectionNodeId: courseDetail?.sections[0].nodes[courseDetail?.sections[0].nodes.length - 1].id,
                        watchedTime: Math.floor(player.currentTime()),
                        isCompleted: true
                    }
                    recordCourseHistory(data);
                    videoRecord.set(currentSection!, true);
                    setVideoRecord(videoRecord);
                    handleWatchCompleted();
                }
            });

            player.addEventListener('pause', () => {
                setVideoStatus(VideoStatus.pause);
            });

            player.addEventListener('play', () => {
                setVideoStatus(VideoStatus.play);
                if(currentSearch && !isOperationGuide && currentSearch !== courseDetail?.sections[0].nodes[0].id){
                    player.currentTime(courseDetail?.sections[0].nodes.find(item => item.id === currentSearch)?.startNumber ?? 0);
                    currentSearch = null;
                }
            });

            // 云课堂视频，拖动进度条后，当前时间节点之前的视频节点都为已完成状态
            player.addEventListener('seeked', () => {
                setVideoStatus(VideoStatus.seeked);
                player.play();
            });
        }
        if(options){
            player?.src(options);
        }  
        
        return () => {
            player?.pause();
            if(videoStatus){
                setVideoStatus(VideoStatus.disposing);
            }
            player?.removeEventListener('ended');
            player?.removeEventListener('pause');
            player?.removeEventListener('play');
            player?.removeEventListener('seeked');
        }
    }, [options, videoRef]);

    // 如果所有视频已看完，标记为已看完
    const handleWatchCompleted = () => {
        if(!courseDetail?.isWatchCompleted){
            let falseValue = Array.from(videoRecord.values()).filter(item => item === false);
            if(falseValue.length === 0){
                recordWatchCompleted(courseDetail?.id ?? '');
            }
        }
    }

    // 定时器
    useEffect(() => {
        if(!isOperationGuide && videoStatus === VideoStatus.play){
            timer = setInterval(() => {
                let currentTime = Math.floor(playerRef.current?.currentTime() ?? 0);
                let currentNode = courseDetail?.sections[0].nodes.find(node => currentTime > node.startNumber && currentTime < node.endNumber)?.id;
                if(currentSection && currentNode && currentNode !== currentSection){
                    let data : CourseHistoryModel = {
                        courseId: courseDetail?.id,
                        sectionId: courseDetail?.sections[0].id,
                        sectionNodeId: currentSection,
                        watchedTime: currentTime,
                        isCompleted: true
                    }
                    recordCourseHistory(data);
                    videoRecord.set(currentSection!, true);
                    setVideoRecord(videoRecord);
                    handleWatchCompleted();
                    setCurrentSection(currentNode);
                    setSearch({p: currentNode}, {replace: true});
                }
            }, 1000);
        }
        return () => timer && clearInterval(timer);
    }, [videoStatus, currentSection])

    return (
        <>
        {loading ? <div className='nodata'><Spin/></div> :
         isForbidden ? <ForbiddenPage/> : isBroken ? <BrokenPage/> :
        <>
        <Typography.Title className='itemTop' level={4}>{courseDetail?.name}</Typography.Title>
        <Affix offsetTop={55}>
            <div className="section-video">
            <video id='zeiss-video' style={{width:'100%',height:isResponsive ? '200px' : '300px'}} ref={videoRef} className="azuremediaplayer amp-default-skin amp-big-play-centered"></video>
            </div>
        </Affix>
        <div className='detail'>
            <div className='detail-header'>
                <div className='detail-title'></div>
                <div className='detail-share'>
                    <Button style={{border: 'none'}} icon={collected ? <HeartFilled style={{color: '#008CD0'}}/> : <HeartOutlined/>} onClick={collectLessonHandle}>收藏</Button>
                    <Button style={{border: 'none'}} icon={<ShareAltOutlined/>} onClick={shareLessonHandle}>分享</Button>
                    {!isOperationGuide && <a target='_blank' rel="noreferrer" href='https://app.jingsocial.com/microFrontend/contentCenterH5/center/LNDyn2nwMoQdacMSrVz2EF?appid=wx0fcf5f767046543b&formSurvey=true&tabid=EysMGgfRsyDSSpg7tdxN8H&openid=oXC1AxDlYjnrkEa2dN4RTKXXN_Mc'><Button style={{border: 'none'}} icon={<DownloadOutlined/>}>下载资料</Button></a>}
                </div>
            </div>
            <div className='detail-description'>{courseDetail?.description}</div>
            {isOperationGuide ? (<>
                {courseDetail?.level === 2 && <div className='examDiv'><Button type='primary' size='small' onClick={handleStartExam} className='examBtn'>{courseDetail.isPassedZExam ? '再次测试' : '测试'}</Button></div>}
                <List
                    itemLayout="horizontal"
                    dataSource={courseDetail?.sections}
                    renderItem={item => (
                    <List.Item
                    key={item.id}
                    onClick={() => {handleSectionChange(item.id)}}
                    >
                        <List.Item.Meta
                        avatar={currentSection === item.id && videoStatus === VideoStatus.play ? <div style={{display: 'grid', color: videoRecord.get(item.id) ? '#000000' : '#7F7F7F'}}><PauseCircleOutlined /><span>{getFormatTime(item.duration)}</span></div> : <div style={{display: 'grid', color: videoRecord.get(item.id) ? '#000000' : '#7F7F7F'}}><PlayCircleOutlined /><span>{getFormatTime(item.duration)}</span></div>}
                        title={<Space style={{color: videoRecord.get(item.id) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id) ? 600 : 400}}>{item.title}</Space>}
                        description={<Space style={{color: videoRecord.get(item.id) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id) ? 600 : 400}}>{item.description}</Space>}
                    />
                </List.Item>
                )}/>
                </>
            ) : 
            (
                <List
                    itemLayout="horizontal"
                    className='alesson'
                    dataSource={courseDetail?.sections[0].nodes}
                    renderItem={item => (
                    <List.Item
                    key={item.id}
                    onClick={() => {handleChapterChange(item.id, item.startNumber)}}
                    >
                        <List.Item.Meta
                        avatar={search.get('p') === item.id && (videoStatus === VideoStatus.play || videoStatus === VideoStatus.seeked) ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        title={<Space style={{color: videoRecord.get(item.id) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id) ? 600 : 400}}>{item.title}</Space>}
                        description={<Space style={{color: videoRecord.get(item.id) ? '#000000' : '#7F7F7F', fontWeight: videoRecord.get(item.id) ? 600 : 400}}>{getFormatTime(item.startNumber)} - {getFormatTime(item.endNumber)}</Space>}
                    />
                </List.Item>
                )}/>
            )}
            <Modal
            width={176}
            title='课程分享'
            visible={shareCodeVisible}
            closable={false}
            footer={[<Button type='default' size='small' onClick={() => {setShareCodeVisible(false)}}>取消</Button>]}
            >
                <QRCode value={window.location.href} />
            </Modal>
            </div>
            </>}
        </>
    )
}
