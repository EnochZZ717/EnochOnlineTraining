import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Divider, message, Progress, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { IAssetRspModel, IBigAssetRspModel } from 'models';
import { SectionService } from 'services';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { RcFile } from 'antd/lib/upload';

export const VideoSelect : FunctionComponent<{currentVideo: IAssetRspModel | undefined, videoType: string, updateVideo: any}> = ({currentVideo, videoType, updateVideo})=> {
  const currentService = SectionService;

  const[videoModels, setVideoModels] = useState<IAssetRspModel[]>();

  const [uploadProgress, setUploadProgress] = useState<IBigAssetRspModel>()

  const [currentFileName, setCurrentFileName] = useState<string>()
  const[uploadStatus, setUploadStatus] = useState<"success" | "normal" | "exception" | "active" | undefined>();

  const[transformPercent, setTransformPercent] = useState<number>();
  const[transformLabel, setTransformLabel] = useState<string>();

  const handleUpload = (options: RcCustomRequestOptions)=>{
    const { file } = options;
    const fileObj = file as RcFile;
    if(fileObj.type === 'video/mp4') {
      const blockSize = 50 * 1024* 1024;
      const blockCount = Math.ceil(fileObj.size/ blockSize);
      let succeed = 0;
      const timeTick = new Date().getTime();
      setCurrentFileName(`${timeTick}-${fileObj.name}`)
      setUploadProgress({
        percent: 0,
        message: '开始上传视频'
      })
      setUploadStatus('active');

      for (let index = 0; index < blockCount; index ++) {
        let fileData = new FormData();
        fileData.append("index", index.toString());
        fileData.append("fileName", `${timeTick}-${fileObj.name}`);
        fileData.append("file", fileObj.slice(index * blockSize, (index + 1) * blockSize));
        fileData.append("total", blockCount.toString());
        fileData.append("type", videoType);

        currentService.uploadVideo(fileData);
      }
    }
    else {
      message.warning("仅支持MP4格式视频")
    }
  }
  
  const handleSelect = (value: string) => {
    if(videoModels){
      const selectVideo = videoModels.find(c => c.id === value);
      if(selectVideo) {
        updateVideo(selectVideo);
      }
    }
  };

  useEffect(() => {
    currentService.getVideos({type: videoType}).then(rsp => {
      if(rsp && rsp.length > 0) {
        setVideoModels(rsp)
      }
    });
  }, [currentService, videoType]);

  useEffect(() => {
    currentService.getVideos({type: videoType}).then(rsp => {
      if(rsp && rsp.length > 0) {
        setVideoModels(rsp)
      }
    });
  }, [currentService, videoType]);

  useEffect(() => {
    if(currentVideo && transformLabel && transformLabel !== "视频转码完成") {
      if(currentVideo.id && currentVideo.id !== '00000000-0000-0000-0000-000000000000') {
        setTransformLabel('视频转码完成');
        setTransformPercent(100);
        currentService.getVideos({type: videoType}).then(rsp => {
          if(rsp.length > 0) {
            setVideoModels(rsp)
            setUploadProgress(undefined);
            setTransformPercent(undefined);
          }
        });
      }
      else {
        if(currentVideo.contentPath && transformPercent !== 100){
          currentService.getVideoState(currentVideo.contentPath, currentVideo.name, videoType).then((rsp) => {
            updateVideo(rsp.data)
            if(rsp.percent !== 100 && transformLabel !== "视频转码中") {              
              setTransformLabel('视频转码中');
            }

            setTransformPercent(rsp.percent)
          })
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentService, transformPercent]);

  return (
    <>
      <Select
        placeholder="请选择一个视频"
        onChange={handleSelect}
        optionLabelProp="label"
        value={currentVideo?.id}
        dropdownRender={menu => (
          <div style={{ margin: '4px 0' }}>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <Upload
              name="file"
              accept='video/mp4'
              showUploadList={false}
              customRequest={handleUpload}
            >
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </Upload>
          </div>
        )}
      >
        {videoModels && videoModels.map((item, index) => (
          <Select.Option key={index} value={item.id} label={item.name}>
           {item.name}
          </Select.Option>
        ))}
      </Select>
      {
        uploadProgress === undefined ? undefined : (
          <>
            <div style={{width: '80%', float:'left'}}>
              <Progress 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={'small'}
                status={uploadStatus}
                percent={uploadProgress.percent} />
            </div>
            <label style={{float:'left', paddingLeft: '10px', paddingTop: '2px'}}>{uploadProgress.message}</label>
          </>
        ) 
      }
      {
        transformPercent === undefined ? undefined : (
          <>
            <div style={{width: '80%', float:'left'}}>
              <Progress 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={'small'}
                percent={transformPercent} />
            </div>
            <label style={{float:'left', paddingLeft: '10px', paddingTop: '2px'}}>{transformLabel}</label>
          </>
        )
      }
    </>
  );
}
