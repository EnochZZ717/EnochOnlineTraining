import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Tabs } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { CategoryType, ICourseRspModel } from 'models';
import { CourseReview, CourseSearch, CourseTable } from 'components';

export const PublishManage: React.FunctionComponent = () => {
  let navigate = useNavigate();
  let location = useLocation()

  const [selectedCourses, setSelectedCourses] = useState<ICourseRspModel[]>();

  const [previewCourse, setPreviewCourse] = useState<ICourseRspModel>();

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [activeKey, setActiveKey] = useState('1');

  const handleSelect = (selectedRows: ICourseRspModel[])=> 
  {
    setSelectedCourses(selectedRows);
  }

  const handlePreview = (courseModel : ICourseRspModel) => {
    setShowReviewModal(true);
    setPreviewCourse(courseModel);
  }

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);    
    sessionStorage.setItem("CategoryName", CategoryType[parseInt(activeKey) - 1]);
    const pathName = location.pathname;
    navigate(pathName);
  }

  useEffect(() => {
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
  },[])

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={22}>
          <Tabs activeKey={activeKey} onChange={handleActiveTab}>
            <Tabs.TabPane tab={CategoryType[0]} key="1">
              <Row style={{marginBottom: 10}}>
                <Col offset={1} span={6}>
                  <CourseSearch placeholder='搜索课程' />
                </Col>
              </Row>
              <Row style={{marginBottom: 10}}>
                <Col offset={1} span={22}>
                  <CourseTable 
                    originSelected={selectedCourses} 
                    categoryRootName={CategoryType[0]} 
                    updateMethod={handleSelect} 
                    preview={handlePreview}
                    isPublished={true} />
                </Col>
              </Row>          
            </Tabs.TabPane>
            <Tabs.TabPane tab={CategoryType[1]} key="2">
              <Row style={{marginBottom: 10}}>
                <Col offset={1} span={6}>
                  <CourseSearch placeholder='搜索课程'/>
                </Col>
              </Row>
              <Row style={{marginBottom: 10}}>
                <Col offset={1} span={22}>
                  <CourseTable 
                    originSelected={selectedCourses} 
                    categoryRootName={CategoryType[1]} 
                    updateMethod={handleSelect} 
                    preview={handlePreview}
                    isPublished={true} />
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
