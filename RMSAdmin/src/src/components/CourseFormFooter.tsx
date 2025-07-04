import { Button, FormInstance, Space } from 'antd';
import { ConfirmModal } from 'components';
import { ICourseRspModel, IWeChatMessageModel } from 'models';
import React, { FunctionComponent } from 'react';
import { WeComService } from 'services';

export const CourseFormFooter: FunctionComponent<{currentCourse: ICourseRspModel | undefined, form: FormInstance, handlePreview: any, save: any, handleDelete: any, isPublished?: boolean}> 
= ({currentCourse, form, handlePreview, save, handleDelete, isPublished}) => {

  const handleDeleteConfirm =() => {
    ConfirmModal({
      title: "是否删除课程？", 
      confirm: () => handleDelete()
    })
  }

  const handleSave = () => {
    if(currentCourse) {
      form.validateFields(["name"]).then(() =>{
        currentCourse.isPublished = undefined
        save(currentCourse)
      })
      .catch(() => {
      })
    }
  }

  const handlePublish = () => {
    if(currentCourse) {
      form.validateFields(["name"]).then(() =>{
        currentCourse.isPublished = true
        save(currentCourse)

        ConfirmModal({
          title: "是否发送消息给发布管理员？", 
          confirm: () => {
            const message : IWeChatMessageModel = {
              msgtype: "text",
              agentid: parseInt(process.env.REACT_APP_WE_CHAT_AGENT_ID as string),
              text: {
                content: `课程 ${currentCourse.name} 已发布`
              }
            }

            WeComService.sendMessage(message).then(rsp=> {
              if(rsp.errorCode === "0") {
                ConfirmModal({
                  title: "消息发送成功",
                })
              }
              else {
                ConfirmModal({
                  title: "消息发送失败",
                })
                console.log(rsp.errorMsg)
              }
            })
          }
        })
      })
      .catch(() => {
      })
    }
  }

  const handleUnPublish = () => {
    if(currentCourse) {
      form.validateFields(["name"]).then(() =>{
        currentCourse.isPublished = false
        save(currentCourse)

        ConfirmModal({
          title: "是否发送消息给发布管理员？", 
          confirm: () => {
            const message : IWeChatMessageModel = {
              msgtype: "text",
              agentid: parseInt(process.env.REACT_APP_WE_CHAT_AGENT_ID as string),
              text: {
                content: `课程 ${currentCourse.name} 已下线`
              }
            }

            WeComService.sendMessage(message).then(rsp=> {
              if(rsp.errorCode === "0") {
                ConfirmModal({
                  title: "消息发送成功",
                })
              }
              else {
                ConfirmModal({
                  title: "消息发送失败",
                })
                console.log(rsp.errorMsg)
              }
            })
          }
        })
      })
      .catch(() => {
      })
    }
  }

  const handleSubmit = () => {
    if(currentCourse) {
      form.validateFields().then(() =>{
        currentCourse.isPublished = false
        save(currentCourse)

        ConfirmModal({
          title: "是否发送消息给发布管理员？", 
          confirm: () => {
            const message : IWeChatMessageModel = {
              msgtype: "text",
              agentid: parseInt(process.env.REACT_APP_WE_CHAT_AGENT_ID as string),
              text: {
                content: `课程 ${currentCourse.name} 已提交，现在可以发布了`
              }
            }

            WeComService.sendMessage(message).then(rsp=> {
              if(rsp.errorCode === "0") {
                ConfirmModal({
                  title: "消息发送成功",
                })
              }
              else {
                ConfirmModal({
                  title: "消息发送失败",
                })
                console.log(rsp.errorMsg)
              }
            })
          }
        })
      })
      .catch(() => {
      })
    }
  }

  return (
    <Space>
      <Button disabled={currentCourse?.isPublished === null} type="primary" onClick={handlePreview}>预览</Button>
      {
        isPublished ? 
        <>
          {
            currentCourse?.isPublished ? 
            <Button type="primary" onClick={handleUnPublish}>下线</Button> :
            <Button type="primary" onClick={handlePublish}>发布</Button>
          }
        </> :
        <>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button type="primary" onClick={handleSubmit}>提交</Button>
          <Button type="default" onClick={handleDeleteConfirm}>删除</Button>
        </>
      }
    </Space>
  );
}

