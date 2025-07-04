import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Space, Tabs } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { CourseService } from 'services';
import { CategoryType, ICourseRspModel } from 'models';
import fileDownload from 'js-file-download';
import { CourseReview, CourseSearch, CourseTable } from 'components';

export const Courses: React.FunctionComponent<{publish?: boolean}> = ({publish}) => {
  let navigate = useNavigate();
  let location = useLocation()

  const currentService = CourseService;

  const [selectedCourses, setSelectedCourses] = useState<ICourseRspModel[]>();

  const [previewCourse, setPreviewCourse] = useState<ICourseRspModel>();

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [activeKey, setActiveKey] = useState('1');

  const [isPublish, setIsPublish] = useState<boolean>();

  const handleSelect = (selectedRows: ICourseRspModel[])=> 
  {
    setSelectedCourses(selectedRows);
  }

  const handleCreate = ()=> 
  {
    navigate('/courses/create');
  }

  const handlePreview = (courseModel : ICourseRspModel) => {
    setShowReviewModal(true);
    setPreviewCourse(courseModel);
  }

  const handleExportTemplate = (courses: ICourseRspModel[] | undefined) => 
  {
    const courseIds = courses ? courses.map(c=>c.id!) : []

    currentService.downloadTemplate(courseIds).then((rsp)=>{
      if(rsp){
        fileDownload(rsp, "课程模板.zip");
      }
    });
  }

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);    
    sessionStorage.setItem("CategoryName", CategoryType[parseInt(activeKey) - 1]);
    const pathName = location.pathname;
    navigate(pathName);
  }

  useEffect(() => {
    setIsPublish(publish)
    const categoryRootName = sessionStorage.getItem("CategoryName");
    if(categoryRootName) {
      if(categoryRootName === CategoryType[0]) {
        setActiveKey('1');
      }
      else {
        setActiveKey('2');
      }
    }
    else {
      sessionStorage.setItem("CategoryName", CategoryType[0]);
      setActiveKey('1');
    }
  },[publish])

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={22}>
          <Tabs activeKey={activeKey} onChange={handleActiveTab}>
            <Tabs.TabPane tab={CategoryType[0]} key="1">
              <Row style={{marginBottom: 10}}>
                <Col span={6}>
                  <CourseSearch placeholder='搜索课程' />
                </Col>
                <Col hidden={isPublish} span={18}>
                  <Space style={{float: 'right'}}>
                    <Button hidden={true} type="primary" onClick={() => handleExportTemplate(selectedCourses)}>导出</Button>
                    <Button type="primary" onClick={handleCreate} >创建</Button>
                  </Space>
                </Col>
              </Row>
              <Row style={{marginBottom: 10}}>
                <Col span={24}>
                  <CourseTable 
                    originSelected={selectedCourses} 
                    categoryRootName={CategoryType[0]} 
                    updateMethod={handleSelect} 
                    preview={handlePreview}
                    isPublished={isPublish} />
                </Col>
              </Row>          
            </Tabs.TabPane>
            <Tabs.TabPane tab={CategoryType[1]} key="2">
              <Row style={{marginBottom: 10}}>
                <Col span={6}>
                  <CourseSearch placeholder='搜索课程'/>
                </Col>
                <Col hidden={isPublish} span={18}>
                  <Space style={{float: 'right'}}>
                    <Button hidden={true} type="primary" onClick={() => handleExportTemplate(selectedCourses)}>导出</Button>
                    <Button type="primary" onClick={handleCreate} >创建</Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <CourseTable 
                    originSelected={selectedCourses} 
                    categoryRootName={CategoryType[1]} 
                    updateMethod={handleSelect} 
                    preview={handlePreview}
                    isPublished={isPublish} />
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>        
      </Row>      
      <Modal 
        title="课程预览" 
        visible={showReviewModal}
        centered={true}
        destroyOnClose={true} 
        footer={(<Button onClick={()=> setShowReviewModal(false)} type="primary">返回</Button>)} 
        onCancel={()=> setShowReviewModal(false)}
      >
        <CourseReview currentCourse={previewCourse} />
      </Modal>    
    </>
  );
}
