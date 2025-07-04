import React, { useState } from 'react';
import { Avatar, Button, Descriptions, Drawer, Space, Image, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from "@ant-design/icons";
import { IEnterpriseUserRspModel } from 'models';

export const HeaderCtl: React.FunctionComponent<{currentUser: IEnterpriseUserRspModel | undefined}> = ({currentUser}) => {
  let navigate = useNavigate()

  const [showProfile, setShowProfile] = useState(false);

  const handleLoginOut = () => {
    sessionStorage.clear()
    setShowProfile(false)
    navigate("/Login")
  }

  const handleProfileClose = () => {
    setShowProfile(false)
  }

  return (
    <>
      <Row>
        <Col xs={12} md={12}>
          <Space style={{float: 'left', width:'15%', paddingTop:'15px', cursor: "pointer"}}>
            <Image alt="logo" src={process.env.PUBLIC_URL + '/assets/images/zeiss.png'} preview={false} onClick={() => navigate('')} />
          </Space>
        </Col>
        <Col xs={0} sm={12}>
          <Space style={{float: 'right', cursor:'pointer'}} onClick={() => setShowProfile(true)}>
            {
              currentUser === undefined ? undefined
                : (
                <>
                  {
                    currentUser?.weChatImagePath !== undefined ? 
                      <Avatar size="large" src={currentUser?.weChatImagePath} /> : 
                      <Avatar size="large" icon={<UserOutlined />} />
                  }
                  <label>{currentUser && currentUser.email}</label>
                </>)
            }
          </Space>
        </Col>
        <Col xs={12} sm={0}>
          <Space style={{float: 'right', cursor:'pointer'}} onClick={() => setShowProfile(true)}>
            {
              currentUser === undefined ? undefined
                : (
                <>
                  {
                    currentUser?.weChatImagePath !== undefined ? 
                      <Avatar size="large" src={currentUser?.weChatImagePath} /> : 
                      <Avatar size="large" icon={<UserOutlined />} />
                  }
                </>)
            }
          </Space>
        </Col>
      </Row>
      <Drawer
        placement="right"
        closable={false}
        onClose={handleProfileClose}
        visible={showProfile}
        footer={(<Space style={{float: 'right'}}><Button type={'primary'} onClick={handleLoginOut}>登出</Button></Space>)}
      >
        <Descriptions 
          title="用户详情" 
          layout={'horizontal'}
          column={1}
          labelStyle={{width: '35%'}}
          bordered
        >
          <Descriptions.Item label="用户名">{currentUser?.name}</Descriptions.Item>
          <Descriptions.Item label="手机号">{currentUser?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{currentUser?.email}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  )
}
