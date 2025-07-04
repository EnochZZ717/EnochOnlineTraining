import { Loading } from 'components';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import { useSearchParams } from 'react-router-dom';

export const AuthRedirect : FunctionComponent = ()=> {
  const [searchParams, ] = useSearchParams();
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.REACT_APP_WE_CHAT_CORP_ID}&redirect_uri=${process.env.REACT_APP_WE_CHAT_REDIRECT_URI}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`

  const [isLoading, setIsLoading] = useState(false);

  const [loadingTip, setLoadingTip] = useState<string>()

  useEffect(() => {
    const { code } = queryString.parse(searchParams.toString())
    if(code === undefined) {      
      window.location.href = authUrl;
      setIsLoading(true);
      setLoadingTip("登录中...")
    }
    else {
      setIsLoading(false)
    }
  },[searchParams])

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
    </>    
  );
}
