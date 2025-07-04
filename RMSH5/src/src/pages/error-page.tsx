import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HttpStatusCode } from '../models/common/http-status-code';
import { sysMsg } from '../models/common/sys-msg';

export function ErrorPage(props: { code: HttpStatusCode }): ReactElement | null {
  const errorText = sysMsg.network.find((e): boolean => e.code === props.code)?.text;

  return <span>{errorText}！</span>;
}

export function ForbiddenPage(){
  const navigate = useNavigate();
  return (
    <div className='center'>
      <div>
        对不起，您没有该课程的访问权限
      </div>
      <div >
        <Button type='primary' onClick={() => {navigate('/home')}}>回到首页</Button>
      </div>
    </div>
  )
}

export function AuthorizationPage(){
  return (
    <div className='center'>
      <div>
        对不起，您没有该页面的访问权限
      </div>
    </div>
  )
}

export function BrokenPage(){
  return (
    <div className='center'>
      <div>
        对不起，该课程无法播放
      </div>
    </div>
  )
}