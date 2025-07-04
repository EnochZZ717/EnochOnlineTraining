import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/login';
import { USER_PROFILE, INITIAL_PATH } from '../../models/common/sys-msg';
import '../../styles/login.scss';

export default function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    
    const handleLogin = () => {
        form.validateFields().then((formdata: any) => {
            getToken(formdata.id).then(result => {
                result && sessionStorage.setItem(USER_PROFILE, JSON.stringify(result));
                if(result && result.code > 0){
                    let initialPath = sessionStorage.getItem(INITIAL_PATH);
                    if(initialPath){
                        navigate(initialPath);
                        sessionStorage.removeItem(INITIAL_PATH);
                    }else{
                        navigate('/home', {state: {isNewUser: false}});
                    }
                }else if(!result || result?.code === 0){
                    navigate('/home', {state: {isNewUser: true}});
                }
            })
        });
    }

    return (
        <div className='main_view_register'>
            <img alt="logo" src='/assets/images/logo.svg' width={150} height={65} />
            <Form
            form={form}
            name='login'
            layout='vertical'
            onFinish={handleLogin}
            >
            <Form.Item label='ID' name='id' rules={[{ required: true, message: '请输入ID' }]}>
                <Input placeholder='请输入ID或电话号码'/>
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit'>登陆</Button>
            </Form.Item>
        </Form>
        </div>
    )
}
