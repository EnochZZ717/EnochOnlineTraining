import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Space } from 'antd';
import { useSearchParams } from "react-router-dom";
import { UserService } from 'services';
import queryString from 'query-string';
import { IUserQueryOption, IUserRspModel } from 'models';
import { Loading, UserSearch, UserTable } from 'components';
import fileDownload from 'js-file-download';

export const Users: React.FunctionComponent<{handleSelect?: any}> = ({handleSelect}) => {
  const [searchParams] = useSearchParams();
  const [userModels, setUserModels] = useState<IUserRspModel[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  const refresh = (query: Partial<IUserQueryOption>) => {
    setIsLoading(true);
    setLoadingTip("加载用户...")
    UserService.getUsers(query).then(rsp => {
      if(rsp && rsp.data instanceof Array) {
        setUserModels([...rsp.data]);
      }
      setIsLoading(false);
    });
  }

  const handleDownload = () => {
    if(userModels) {
      const query: Partial<IUserQueryOption> = queryString.parse(searchParams.toString())
      UserService.downloadUsers(query).then(rsp => {
        if(rsp){
          fileDownload(rsp, "用户数据.xlsx");
        }
      });
    }
  }

  useEffect(() => {
    const query: Partial<IUserQueryOption> = queryString.parse(searchParams.toString())
    refresh(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />     
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={22}>
          <Row>
            <Col span={12}>
              <UserSearch />
            </Col>
            <Col span={12}>
              <Space style={{float:'right'}}>
                <Button hidden={handleSelect!== undefined} type="primary" onClick={handleDownload}>下载数据</Button>
              </Space>
            </Col>
          </Row>
          <Row style={{marginTop: 10}}>
            <Col>              
              <UserTable 
                handleSelect={handleSelect} 
                currentUsers={userModels} 
                loading={false} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
