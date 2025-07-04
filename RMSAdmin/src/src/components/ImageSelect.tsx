import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Divider, message, Select, Image, Upload, Space } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { IAssetQueryOption, IAssetRspModel } from 'models';
import { RcFile } from 'antd/lib/upload';
import { AssetService } from 'services';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

export const ImageSelect : FunctionComponent<{currentImage: IAssetRspModel | undefined, originImages: IAssetRspModel[] | undefined, imageType: string, updateMethod: any}> = ({currentImage, originImages, imageType, updateMethod})=> {
  const currentService = AssetService;

  const[imageUrls, setImageUrls] = useState<IAssetRspModel[]>();

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleUpload =  async (options: RcCustomRequestOptions)=> 
  {
    const { file } = options;
    let fileData = new FormData();
    fileData.append("type", imageType);
    fileData.append("files", file);
    currentService.postImage(fileData).then(rsp => {
      if(rsp && rsp.length > 0){
        updateMethod(rsp[0])
        refreshImages()
      }
    })
  }

  const refreshImages = () => {
    const queryOption : IAssetQueryOption = {
      type: imageType
    }
    currentService.getImages(queryOption).then(rsp => {
      if(rsp && rsp instanceof Array) {
        setImageUrls(rsp);
      }
    });
  }
  
  const handleSelect = (value: string) => {
    if(imageUrls){
      const selectImage = imageUrls.find(c=>c.id === value);
      updateMethod(selectImage);
    }      
  };

  useEffect(() => {
    refreshImages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentService]);

  return (
    <>
      <Select
        placeholder="请选择一张图片"
        optionLabelProp="label"
        onChange={handleSelect}
        value={currentImage?.id}
        dropdownRender={menu => (
          <div style={{ margin: '4px 0' }}>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <Upload
              name="file"              
              showUploadList={false}
              customRequest={handleUpload}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </div>
        )}
      >
        {
          originImages &&
          <Select.OptGroup label={'视频封面'} key={1}>
            {originImages.map((item, index) => (
              <Select.Option key={"1" + index} value={item.id} label={<img src={item.contentPath} alt="avatar" style={{ height: 25 }}></img>}>
                <Image src={item.contentPath} alt="avatar" style={{ height: 40 }} />
              </Select.Option>
            ))}
          </Select.OptGroup>
        }        
        <Select.OptGroup label={'默认图片'} key={2}>
          {imageUrls && imageUrls.map((item, index) => (
            originImages === undefined || !originImages.find(t=>t.id === item.id) ?
            <Select.Option key={"2" + index} value={item.id} label={<img src={item.contentPath} alt="avatar" style={{ height: 25 }}></img>}>
              <Image src={item.contentPath} alt="avatar" style={{ height: 40 }} />
            </Select.Option> : undefined
          ))}
        </Select.OptGroup>
      </Select>
      <Space style={{ marginTop: 5 }}>
        {currentImage && <Image src={currentImage.contentPath} alt="avatar" style={{ height: 100 }} />}
      </Space>
    </>
  );
}
