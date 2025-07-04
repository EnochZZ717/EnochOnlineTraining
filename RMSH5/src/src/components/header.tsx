import React, { useEffect, useState } from 'react';
import { Affix, Layout, Menu, Image, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { USER_PROFILE } from '../models/common/sys-msg';
import { RESPONSIVE_THRESHOLD } from '../models/common/sys-msg';
import '../styles/common.scss';

export default function Header() {
    const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');
    const location = useLocation();
    const url = location.pathname.toLocaleLowerCase();
    const [defaultKey, setDefaultKey] = useState<string>(url);
    const isResponsive = window.screen.width < RESPONSIVE_THRESHOLD;
    const navigate = useNavigate();

    useEffect(() => {
        url === '/' ? setDefaultKey('/home') : setDefaultKey('/' + url.split('/')[1]);
    }, [url])

    const config = [
        {
            key: '/home',
            to: '/home',
            text: '首页'
        },
        {
            key: '/azurelessons',
            to: '/azureLessons',
            text: '云课堂'
        },
        {
            key: '/operationguide',
            to: '/operationGuide',
            text: '培训课程'
        },
        {
            key: '/studygroups',
            to: '/studyGroups',
            text: '学习小组'
        },
        {
            key: '/personalcenter',
            to: '/personalCenter',
            text: '个人中心'
        }
    ]

    const handleMemuLogoChange = (key: string) => {
        let isSelected = key === defaultKey;
        switch(key){
            case '/home':
                return isSelected ? '/assets/images/home02_d.png' : '/assets/images/home01.png';
            case '/azurelessons':
                return isSelected ? '/assets/images/classroom_d.png' : '/assets/images/classroom.png';
            case '/operationguide':
                return isSelected ? '/assets/images/train_d.png' : '/assets/images/train.png';
            case '/studygroups':
                return isSelected ? '/assets/images/plan_d.png' : '/assets/images/plan.png';
            case '/personalcenter':
                return isSelected ? '/assets/images/personage_d.png' : '/assets/images/personage.png';
            default:
                return isSelected ? '/assets/images/home02_d.png' : '/assets/images/home01.png';
        }
    }

    const handleUserLogout = () => {
        Modal.confirm({
            icon: undefined,
            title: undefined,
            width: 250,
            className: 'textCenter',
            content: '确定要退出当前账户吗？',
            onOk: () => {
                sessionStorage.removeItem(USER_PROFILE);
                navigate('/login');
            }
        })
    }

    return (
        <Affix>
            <Layout.Header>
                <div>
                <NavLink to='/home'>
                <Image alt="logo" src='/assets/images/zeiss.png' preview={false} className={isResponsive ? 'responsive_logo' : 'logo'}/>
                </NavLink>
                    {
                        isResponsive ? <Menu
                        mode="horizontal"
                        className='responsive_menu'
                        selectedKeys={[defaultKey]}
                        >
                        {
                            config.map(item => {
                                if(item.key === '/studygroups'){
                                    if(user?.user?.isMemberGroupLeader || user?.user?.isMemberGroupMember){
                                        return <Menu.Item className='navItem' key={item.key}><NavLink to={item.to}><Image width={23} height={20} src={handleMemuLogoChange(item.key)} preview={false}/><div className='navItemText'>{item.text}</div></NavLink></Menu.Item>
                                    }else{
                                        return null;
                                    }
                                }else{
                                    return <Menu.Item key={item.key} className='navItem'><NavLink to={item.to}><Image width={23} height={20} src={handleMemuLogoChange(item.key)} preview={false}/><div className='navItemText'>{item.text}</div></NavLink></Menu.Item>
                                }
                            })
                        }
                    </Menu> : <Menu
                        mode="horizontal"
                        className='menu'
                        selectedKeys={[defaultKey]}
                        >
                        {
                            config.map(item => {
                                if(item.key === '/studygroups'){
                                    if(user?.user?.isMemberGroupLeader || user?.user?.isMemberGroupMember){
                                        return <Menu.Item key={item.key}><NavLink to={item.to}>{item.text}</NavLink></Menu.Item>
                                    }else{
                                        return null;
                                    }
                                }else{
                                    return <Menu.Item key={item.key}><NavLink to={item.to}>{item.text}</NavLink></Menu.Item>
                                }
                            })
                        }
                    </Menu>
                    }
                </div>
                <div>
                {!isResponsive && user?.user && <div className='pointer' onClick={handleUserLogout} title='退出当前账户'><LogoutOutlined /></div>}
                </div>
            </Layout.Header>
        </Affix>
    )
}
