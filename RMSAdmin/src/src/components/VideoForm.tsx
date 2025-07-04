import { Button, Col, Row, Space } from "antd"
import { FunctionComponent, useEffect, useState } from "react";
import { ISectionModel } from "models";
import { SectionService } from "services";
import { ConfirmModal, VideoPlayer } from "components";

export const VideoForm : FunctionComponent<{currentSection: ISectionModel | undefined, save: any, isPublished?: boolean, handleDeleteItem?: any}> 
= ({currentSection, save, isPublished, handleDeleteItem}) => {
  const currentService = SectionService;

  const [sectionModel, setSectionModel] = useState<ISectionModel>();

  const [videoJsOptions, setVideoJsOptions] = useState<{src: string, type: string, token?: string}>();

  const [duration, setDuration] = useState<number>();

  const section = sectionModel!;

  const setSection = (sectionProps: Partial<ISectionModel>) => {
    if(isPublished) {
      ConfirmModal({
        title: "该课程已发布, 请先下线此课程！",
      })
    }
    else {
      setSectionModel({...section, ...sectionProps })
    }    
  }

  const handleOk = () => {
    if(sectionModel) {
      sectionModel.duration = duration ?? 0;
      sectionModel.contentLink = videoJsOptions?.src!;
      save(sectionModel);
    }    
  };

  const videoElement = () =>{
    let element = (<div className="preview-result">视频预览</div>);
    if(sectionModel) {
      if(sectionModel.assetName || sectionModel.contentLink) {
        element = (<VideoPlayer
          options={videoJsOptions} 
          currentSection={sectionModel}
          setSection={setSection}
          updateDuration={(duration: number) => {
            setDuration(duration);
            if(sectionModel.nodes && sectionModel.nodes.length > 0) {
              const nodes = sectionModel.nodes;
              if(nodes[0].endNumber === 0) {
                nodes[0].endNumber = duration;
                setSection({nodes: nodes})
              }
            }
          }}
          isPublished={isPublished}
          handleDeleteItem={handleDeleteItem}/>)
      }
    }

    return element;
  }

  useEffect(() => {
    if (currentSection) {
      setSectionModel(currentSection)
    }  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  useEffect(() => {
    if(currentSection) {
      if(currentSection.contentType === 'PDF') {            
        const contentLink = currentSection.contentLink;
      }
      else {
        if(currentSection.assetName){
          currentService.getEncryptedVideo(currentSection.assetName).then(rsp=>{
            if(rsp){
              const videoOptions = {
                src: rsp.contentPath, 
                type: 'application/vnd.ms-sstr+xml', 
                token: rsp.token
              }
              setVideoJsOptions(videoOptions);
            }
          })
        }
        else if (currentSection.contentLink) {
          const videoOptions = {
            src: currentSection.contentLink, 
            type: 'video/mp4',
          }
          setVideoJsOptions(videoOptions);
        }
        else {
          setVideoJsOptions(undefined);
        }
      }
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection?.id, currentSection?.assetName, currentService]);

  return (
    <>
      <Row>
        <Col span={24}>
          { currentSection?.contentType === 'Pdf' 
              ? <div className="preview-result">PDF预览</div>
              : videoElement() }
        </Col>
      </Row>
      {
        !isPublished && 
        <Row style={{marginTop: 20}}>
          <Col span={24} style={{textAlign: 'left'}}>
            <Space>
                          
              <Button type="primary" onClick={handleOk}>确认</Button>
            </Space>
          </Col>
        </Row>
      }
    </>
  )
}