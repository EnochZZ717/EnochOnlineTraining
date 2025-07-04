import { Button, Col, Form, Input, Row, Select } from "antd"
import { FunctionComponent } from "react";
import { ISeriesNumberRspModel, ISingleCategoryRspModel } from "models";
import { SeriesNumberList } from "components";

export const SeriesNumberForm : FunctionComponent<{currentCategory: ISingleCategoryRspModel | undefined, categories: ISingleCategoryRspModel[] | undefined, update: any, save: any, handleDeleteItem?: any}> 
= ({currentCategory, categories, update, save, handleDeleteItem}) => {

  const handleOk = () => {
    save()
  };

  const handelCategoryChange = (value: string) => {
    // update(value)
  };

  const handleSNManage = (item: ISeriesNumberRspModel)=> {
    if(currentCategory) {      
      const seriesNumbers = currentCategory?.seriesNumbers;
      let index;
      if(item.id) {
        index = seriesNumbers.findIndex(c=>c.id === item.id);
      }
      else {
        index = seriesNumbers.findIndex(c=>c.seriesNumbers === item.seriesNumbers);
      }
      
      if(index < 0) {
        seriesNumbers.push(item)
      }
      else {
        seriesNumbers[index] = item;
      }

      update({seriesNumbers: [...seriesNumbers]})
    }
  }

  const handleSNDelete = (item: ISeriesNumberRspModel)=> {
    if(currentCategory) {      
      const seriesNumbers = currentCategory?.seriesNumbers;
      const index = seriesNumbers.findIndex(c=>c.id === item.id);
      seriesNumbers.splice(index, 1)
      update({seriesNumbers: [...seriesNumbers]})
      handleDeleteItem(item)
    }
  }

  return (
    <>
      <Form 
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
      >
        <Form.Item label="分类">
          <Select
            disabled={true}
            onChange={handelCategoryChange}
            value={currentCategory?.title}
          >
            {
              categories?.map((item, index) => (
                <Select.Option key={index} value={item.id!}>
                  {item.title}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>          
        <Form.Item label="序列号" >
          <Row style={{height: 400}}>
            <Col span={24}>
              <SeriesNumberList 
                currentCategory={currentCategory}
                manage={handleSNManage}
                handleDelete={handleSNDelete} />
            </Col>
          </Row>         
        </Form.Item>
        <Form.Item label="备注">
          <Input.TextArea rows={4} value={currentCategory?.description} onChange={(val: any) => update({ description: val.target.value})}></Input.TextArea>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4}}>
          <Button type="primary" onClick={handleOk}>保存</Button>
        </Form.Item>
      </Form>
    </>
  )
}