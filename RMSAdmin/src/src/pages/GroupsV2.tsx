import { Button, Col, Row, Space, Tabs } from 'antd';
import { GroupManagerStatusTable, GroupManagerTable, GroupStatusTable, Loading } from 'components';
import { IGroupManagerStatusRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupService, UserService } from 'services';
import { LeftOutlined} from '@ant-design/icons';
import fileDownload from 'js-file-download';

const { TabPane } = Tabs;
export const GroupsV2 : FunctionComponent = () => {
  const navigate = useNavigate();
  
  const [groupManagers, setGroupManagers] = useState<IGroupManagerStatusRspModel[]>();

  const [currentManagerStatus, setCurrentManagerStatus] = useState<IGroupManagerStatusRspModel>();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  const [showGroupStatus, setShowGroupStatus] = useState(false);

  const [activeKey, setActiveKey] = useState('1');

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  }

  const handleManageLeader = (groupManager: IGroupManagerStatusRspModel) => {
    navigate(`/groups/${groupManager.manager.id}`)
  }

  const handleCreate = () => {
    navigate(`/groups/create`)
  }

  const handleDownload = () => {
    GroupService.downloadGroupManagers().then(rsp => {
      if(rsp) {
        fileDownload(rsp, "组长使用情况.xlsx");
      }
    })
  }

  const showManagerGroupStatus = (groupManager: IGroupManagerStatusRspModel) => {
    setCurrentManagerStatus(groupManager);
    setShowGroupStatus(true);
  }

  const refreshGroupManagers = () => {
    setIsLoading(true)
    setLoadingTip("加载组长...")
    GroupService.getGroupManagers().then(rsp => {
      if(rsp && rsp instanceof Array) {
        setGroupManagers(rsp);
      }
      
      setIsLoading(false)
    })
  }

  useEffect(() => {
    refreshGroupManagers()
  }, []);
  
  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      {
        showGroupStatus ?
        <Row>
          <Col span={24}>
            <Button type="text" icon ={<LeftOutlined />} onClick={() => setShowGroupStatus(false)}>{`${currentManagerStatus?.manager.user.name}的学习小组情况`}</Button>
            <Row style={{marginTop: 10}}>
              <Col offset={1} span={22}>
                <GroupStatusTable
                  currentGroups={currentManagerStatus?.groups}
                  loading={false} />
              </Col>
            </Row>
          </Col>
        </Row> :
        <Row style={{marginTop: 10}}>
          <Col offset={1} span={22}>
            <Tabs activeKey={activeKey} onChange={handleActiveTab}>
              <TabPane tab="组长" key="1">                
                <Row gutter={24} style={{marginBottom: 10}}>
                  <Col span={24}>
                    <Space style={{float:'right'}}>
                      <Button type="primary" onClick={handleCreate}>新建组长</Button>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <GroupManagerTable 
                      currentGroupManagers={groupManagers} 
                      loading={false} 
                      handleSelect={handleManageLeader} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="使用情况" key="2">                
                <Row gutter={24} style={{marginBottom: 10}}>
                  <Col span={24}>
                    <Space style={{float:'right'}}>
                      <Button type="primary" onClick={handleDownload}>下载数据</Button>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <GroupManagerStatusTable 
                      currentGroupManagers={groupManagers} 
                      loading={false} 
                      handleSelect={showManagerGroupStatus} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      }      
    </>
  )
}