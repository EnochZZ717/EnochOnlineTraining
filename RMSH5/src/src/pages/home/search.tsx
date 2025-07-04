import React, { useEffect, useRef, useState } from 'react';
import { Input, message, Tag } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { getQuickSearchConfig } from '../../services/home';
import '../../styles/azureLessons.scss';
import '../../styles/home.scss';

export default function Search(props: {isHomeSearch: boolean, callBack?: CallableFunction}) {
    const searchRef = useRef<Input>(null);
    const navigate = useNavigate();
    const {isHomeSearch, callBack} = props;
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [tagShow, setTagShow] = useState<boolean>(false);
    const location = useLocation();
    const [defaultValue] = useState<string>(location.state?.isNewUser === true || location.state?.isNewUser === false ? '' : location.state);
    
    useEffect(() => {
        !isHomeSearch && getQuickSearchConfig().then(result => {
            setSearchTags(result);
        })
    }, []);

    const handleSearch = () => {
        let value = searchRef.current?.state.value;
        if(value){
            if(isHomeSearch){
                callBack!(value);
            }else{
                navigate(`search`, {state: value})
            }
        }else{
            message.destroy();
            message.info("请输入搜索课程关键字", 3);
        }
    }

    const handleQuickSearch = () => {
        !isHomeSearch && setTagShow(true);
    }

    const handleNonQuickSearch = (e: any) => {
        e.stopPropagation();
        !isHomeSearch && setTagShow(false);
    }

    const handleMouseDownTag = (e: any) => {
        let tagKey = e.target.innerText;
        navigate(`search`, {state: tagKey})
    }

    return (
        <div className='global_search'>
            <Input placeholder="搜索课程" onBlur={handleNonQuickSearch} defaultValue={defaultValue} allowClear className='banner' ref={searchRef} onFocus={handleQuickSearch} onPressEnter={handleSearch} addonAfter={<SearchOutlined onClick={handleSearch}/>}/>
            <div className='tagCard global_search_tag' hidden={!tagShow}>
                {
                    searchTags?.map((item: string) => {
                        return <Tag key={item} onMouseDown={handleMouseDownTag} className='typeTag'>{item}</Tag>
                    })
                }
            </div>
        </div>
    )
}
