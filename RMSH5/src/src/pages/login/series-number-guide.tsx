import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { getGuideVideo } from '../../services/login';
import { GuideVideoModel } from '../../models/login';
import { RESPONSIVE_THRESHOLD } from '../../models/common/sys-msg';

export default function SeriesNumberGuide() {
    const [guideVideos, setGuideVideos] = useState<GuideVideoModel[]>([]);
    const [visible, setVisible] = useState(false);
    const isResponsive = window.screen.width < RESPONSIVE_THRESHOLD;

    useEffect(() => {
        getGuideVideo().then(result => {
            setGuideVideos(result);
        })

        return () => {
            setGuideVideos([]);
        }
    },[]);

    return (
        <>
        <div style={{textAlign: 'center'}} className='pointer' onClick={(e) => {e.stopPropagation(); setVisible(true)}}>点击此处查看<span style={{color: '#008BD0'}}>如何找到序列号?</span></div>
        <Modal
        title='SN向导'
        centered
        visible={visible}
        onOk={() => {setVisible(false)}}
        onCancel={() => setVisible(false)}
        okText='知道了'
        cancelText='关闭'
        width={620}
        closable
        >
        {
            guideVideos.map((item: GuideVideoModel) => {
                return (
                    <div style={{marginBottom: 20}} key={item.name}>
                        <h3>{item.name}</h3>
                        <video width='100%' height={isResponsive ? '200' : '300px'} controls>
                            <source src={item.contentPath} type="video/mp4"/>
                        </video>
                        <span style={{color: '#959595', fontSize: 12}}>{item.description}</span>
                    </div>
                )
            })
        }
        </Modal>
        </>
    )
}
