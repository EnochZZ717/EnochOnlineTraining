import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Form, Row, Space, Tabs } from 'antd';
import { CourseService } from 'services';
import { IReportRspModel, IDateTimeOption, IReportOverviewRspModel } from 'models';
import { Loading, ReportOverview, ReportTable } from 'components';
import moment from 'moment';
import fileDownload from 'js-file-download';

export const Reports: React.FunctionComponent = () => {
  const [reportModels, setReportModels] = useState<IReportRspModel[]>();
  const [reportOverviewModel, setReportOverviewModel] = useState<IReportOverviewRspModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()
  const [activeKey, setActiveKey] = useState('1');

  const [dateTimeOption, setDateTimeOption] = useState<IDateTimeOption>({})

  const [form] = Form.useForm()

  const timeValidator = (rule: any, value: any, callback: any) =>{
    if(dateTimeOption) {
      if(dateTimeOption.startTime && dateTimeOption.endTime && moment(dateTimeOption.startTime) > moment(dateTimeOption.endTime) ) {
        callback('开始时间不能大于结束时间!');
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  }

  const handleSearch = async () => {
    if(dateTimeOption) {
      if(dateTimeOption.endTime === undefined) {
        dateTimeOption.endTime = new Date()
      }
      form.validateFields().then(() => {
        if(activeKey === "1") {
          refreshReportOverview(dateTimeOption)
        }
        else {
          refreshReportDetail(dateTimeOption)
        }
      })
    }
  }

  const handleReset = async () => {
    const defaultTimeOption : IDateTimeOption = {startTime: undefined, endTime: undefined}
    form.setFieldsValue(defaultTimeOption)
    if(activeKey === "1") {
      refreshReportOverview(defaultTimeOption)
    }
    else {
      refreshReportDetail(defaultTimeOption)
    }
    
    setDateTimeOption(defaultTimeOption)
  }

  const handleDownload = () => {
    if(dateTimeOption) {
      if(dateTimeOption.endTime === undefined) {
        dateTimeOption.endTime = new Date()
      }
      form.validateFields().then(() => {
        CourseService.downloadCourseReports(dateTimeOption).then(rsp => {
          if(rsp) {
            fileDownload(rsp, "课程报告.xlsx");
          }
        })
      })
    }
    
  }

  const refreshReportDetail = (query: IDateTimeOption) => {
    setIsLoading(true);
    setLoadingTip("加载报告详情...")
    CourseService.getCourseReports(query).then(rsp => {
      if(rsp && rsp instanceof Array) {
        setReportModels([...rsp]);
      }
      setIsLoading(false);
    });
  }

  const refreshReportOverview = (query: IDateTimeOption) => {
    setIsLoading(true);
    setLoadingTip("加载报告总览...")
    CourseService.getCourseReportOverview(query).then(rsp => {
      if(rsp) {
        setReportOverviewModel(rsp);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    if(activeKey === "1") {
      refreshReportOverview(dateTimeOption)
    }
    else {
      refreshReportDetail(dateTimeOption)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />     
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={22}>
          <Row >
            <Col>
              <Form form={form} layout={'inline'}>
                <Form.Item 
                  label={'开始时间'}
                  name={'startTime'}
                  rules={[{validator: timeValidator}]}
                >
                  <DatePicker 
                    placeholder='请选择时间'
                    value={dateTimeOption?.startTime && moment(dateTimeOption.startTime)}
                    disabledDate={(currentDate : moment.Moment) => currentDate > moment(new Date())}
                    onChange={(value: any, dateString: string) => setDateTimeOption({...dateTimeOption, startTime: value})}
                  />
                </Form.Item>
                <Form.Item 
                  label={'结束时间'}
                  name={'endTime'}
                >
                  <DatePicker
                    placeholder='请选择时间'
                    value={dateTimeOption?.endTime && moment(dateTimeOption?.endTime)}
                    disabledDate={(currentDate : moment.Moment) => currentDate < moment(dateTimeOption?.startTime) || currentDate > moment(new Date())}
                    onChange={(value: any, dateString: string) => setDateTimeOption({...dateTimeOption, endTime: value})}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type='primary' onClick={handleSearch}>搜索</Button>
                </Form.Item>
                <Form.Item>
                  <Button type='primary' onClick={handleReset}>重置</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row style={{marginTop: 10}}>
            <Col>
              <Tabs activeKey={activeKey} onChange={handleActiveTab}>
                  <Tabs.TabPane tab="总览" key="1">
                    <Row>
                      <Col span={24}>
                        <ReportOverview 
                          currentReportOverview={reportOverviewModel} />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="报告详情" key="2">
                    <Row gutter={24} style={{marginBottom: 10}}>
                      <Col span={24}>
                        <Space style={{float:'right'}}>
                          <Button type="primary" onClick={handleDownload}>下载数据</Button>
                        </Space>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <ReportTable 
                          handleSelect={undefined} 
                          currentReports={reportModels} 
                          loading={false} />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
