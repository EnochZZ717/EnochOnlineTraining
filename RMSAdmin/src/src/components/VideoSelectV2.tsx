import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Input, Progress, Row, Tooltip, Upload } from "antd";
import { IAssetRspModel, IBigAssetRspModel } from 'models';
import { SectionService } from 'services';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { RcFile } from 'antd/lib/upload';
import { ConfirmModal } from 'components';

export const VideoSelectV2 : FunctionComponent<{currentVideo: IAssetRspModel | undefined, videoType: string, updateVideo: any, disabled?: boolean, setInProgress: any}> 
= ({currentVideo, videoType, updateVideo, disabled, setInProgress})=> {
  const currentService = SectionService;

  const [uploadProgress, setUploadProgress] = useState<IBigAssetRspModel>()

  const [transformProgress, setTransformProgress] = useState<IBigAssetRspModel>()

  const [uploadStatus, setUploadStatus] = useState<"success" | "normal" | "exception" | "active" | undefined>();

  const [transformStatus, setTransformStatus] = useState<"success" | "normal" | "exception" | "active" | undefined>();

  const handleUpload = (options: RcCustomRequestOptions) =>{
    const { file } = options;
    const fileObj = file as RcFile;
    currentService.setErrorHandler((err) => {
      setUploadProgress({
        percent: 100,
        message: `视频上传失败-${err}`
      })
    });
    if(fileObj.type === 'video/mp4') {
      const fileName = encodeURI(fileObj.name)
      currentService.getVideoUploadStatus(fileName).then(rsp => {
        if(rsp) {
          ConfirmModal({
            title: `视频：${fileName} 正在上传中， 请稍后再试`,
          })
        }
        else {
          const blockSize = 50 * 1024* 1024;
          const blockCount = Math.ceil(fileObj.size/ blockSize);
          setUploadProgress({
            percent: 0,
            message: '开始上传视频'
          })
          setUploadStatus('active');
          setInProgress(true);

          for (let index = 0; index < blockCount; index ++) {
            let fileData = new FormData();
            fileData.append("index", index.toString());
            fileData.append("fileName", fileName);
            fileData.append("file", fileObj.slice(index * blockSize, (index + 1) * blockSize));
            fileData.append("total", blockCount.toString());
            fileData.append("type", videoType);

            currentService.uploadVideo(fileData).then((rsp) => {
              if(rsp && rsp.percent !== undefined) {
                setUploadProgress(rsp)
              }
            });
          }
        }
      })      
    }
    else {
      ConfirmModal({
        title: `视频格式支持MP4, 请换一个视频再试`,
      })
    }
  }

  useEffect(() => {
    if(uploadProgress && uploadProgress.percent === 100) {
      if(uploadProgress.data) {
        setUploadStatus('success');
        updateVideo(uploadProgress.data);
        setTransformProgress({
          percent: 0,
          data: uploadProgress.data,
          message: '开始视频转码'
        })
      }
      else {
        setUploadStatus('exception');
      }   
    }
  }, [uploadProgress]);

  useEffect(() => {
    if(transformProgress && transformProgress.percent === 100) {
      if(transformProgress.data) {
        setTransformStatus('success');
        updateVideo(transformProgress.data);
        setUploadProgress(undefined);
        setTransformProgress(undefined);
      }
      else {
        setTransformStatus('exception');
      }
    }
  }, [transformProgress]);

  useEffect(() => {
    if(transformProgress && transformProgress.percent !== 100) {
      currentService.setErrorHandler((err) => {
        setTransformProgress({
          percent: 100,
          message: `视频上传失败-${err}`
        })
      });
      
      if (transformProgress.data && transformProgress.data.id === '00000000-0000-0000-0000-000000000000') {
        currentService.getVideoState(transformProgress.data.contentPath, transformProgress.data.name, videoType).then((rsp) => {
          setTransformProgress(rsp)
        })
      }
      else {
        setTransformProgress({
          ...transformProgress,
          percent: 100
        })
      }      
    }
  }, [currentService, transformProgress]);

  return (
    <>
      <Row>
        <Col span={17}>
          <Input value={currentVideo?.name} readOnly={true} />
        </Col>
        <Col hidden={disabled} offset={1} span={6}>
          <Upload
            name="file"
            accept='.mp4'
            showUploadList={false}
            customRequest={handleUpload}
          >
            <Button>{currentVideo?.contentPath === undefined ? "上传视频" : "重新上传"}</Button>
          </Upload>
        </Col>
      </Row>
      <Row hidden={uploadProgress !== undefined} style={{marginTop: 5, fontSize:12}}>
        <Col className='ant-form-item-explain-error'>
          *MP4格式，1920*1080
        </Col>
      </Row>      
      {
        uploadProgress === undefined ? undefined : (
          <Row>
            <Col span={16}>
              <Progress 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={'small'}
                status={uploadStatus}
                percent={uploadProgress.percent} />
            </Col>
            <Col offset={1} span={7} style={{marginTop: 2}}>
              {
                uploadProgress.message && uploadProgress.message.includes("-") ? 
                  <Tooltip title={uploadProgress.message}>
                    {uploadProgress.message.split("-")[0]}
                  </Tooltip> :
                  uploadProgress.message
              }
            </Col>
          </Row>
        ) 
      }
      {
        transformProgress === undefined ? undefined : (
          <Row>
            <Col span={16}>
              <Progress 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={'small'}
                status={transformStatus}
                percent={transformProgress.percent} />
            </Col>
            <Col offset={1} span={7} style={{marginTop: 2}}>
              {
                transformProgress.message && transformProgress.message.includes("-") ? 
                  <Tooltip title={transformProgress.message}>
                    {transformProgress.message.split("-")[0]}
                  </Tooltip> :
                  transformProgress.message
              }
            </Col>
          </Row>
        )
      }
    </>
  );
}
