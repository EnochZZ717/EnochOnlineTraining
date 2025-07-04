import React from 'react';
import { Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ICourseQueryOption } from 'models';

export const CourseSearch: React.FunctionComponent<{placeholder?: string, handleRefresh?: any }> = ({placeholder, handleRefresh}) => {
  let location = useLocation()
  let navigate = useNavigate()

  const handleSearch = (value: string) =>{
    const pathName = location.pathname;
    let query: Partial<ICourseQueryOption> | undefined = undefined
    if(value.length > 0) {
      query = {
        name: value
      }
    }
    if (query) {
      navigate(queryString.stringifyUrl({url: pathName, query: {...query}}))
      if(handleRefresh) {
        handleRefresh()
      }
    }
  }

  const handleChange = (value: string) =>{
    const pathName = location.pathname;
    if(value.length === 0) {
      navigate(pathName)
      if(handleRefresh) {
        handleRefresh()
      }
    }
  }

  return (
    <>
      <Input.Search
        size="middle" 
        placeholder={placeholder}
        allowClear={true}
        onBlur={(e) => handleChange(e.target.value)}
        onSearch={(value)=> handleSearch(value)}
        style={{width:'100%'}} />
    </>
  )
}
