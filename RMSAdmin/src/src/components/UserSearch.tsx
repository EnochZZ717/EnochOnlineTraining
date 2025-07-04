import React, { useRef } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { IUserQueryOption } from 'models';

export const UserSearch: React.FunctionComponent = () => {
  let location = useLocation()
  let navigate = useNavigate()

  const inputRef = useRef<Input>(null);

  const handleSearch = () => {
    const pathName = location.pathname;
    let query: Partial<IUserQueryOption> | undefined = undefined
    if(inputRef.current && inputRef.current.input.value.length > 0) {
      query = {
        phoneNumber: inputRef.current.input.value
      }
    }
    if (query) {
      navigate(queryString.stringifyUrl({url: pathName, query: {...query}}))
    }
  }

  const handleChange = (value: string) =>{
    const pathName = location.pathname;
    if(value.length === 0) {
      navigate(pathName)
    }
  }

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Form layout={'inline'} onFinish={() => handleSearch()}>
          <Form.Item>
            <Input
              size="middle" 
              ref={inputRef}
              allowClear={true}
              onBlur={(e) => handleChange(e.target.value)}
              placeholder='请输入手机号码'
              style={{width:'100%'}} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={handleSearch}>查找</Button>
          </Form.Item>
        </Form>        
      </Col>
    </Row>
  )
}
