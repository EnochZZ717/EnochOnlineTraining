import React, { FunctionComponent } from 'react';

export const HomeReview : FunctionComponent = () => {
  const h5SiteUrl = process.env.REACT_APP_H5_SITE;

  return (
    <>
      <div id='codeArea' style={{height:'calc(100vh)'}}>
        <iframe title='login' frameBorder='0' sandbox='allow-scripts allow-forms allow-same-origin allow-top-navigation' scrolling='auto'  
        src={`${h5SiteUrl}embedhome`} height={"100%"} width={"100%"}></iframe>
      </div>
    </>
  )
}
