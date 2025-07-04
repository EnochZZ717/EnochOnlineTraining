import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Cascader, message, Checkbox, Modal, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { CommonBaseModel, ProvinceModel, LocationModel, CityModel } from '../../models/common-data';
import { getIndustries, getProvince, userRegister, getBussinessType } from '../../services/login';
import { UserRegisterModel } from '../../models/login';
import { UserModel } from '../../models/personal-center';
import SeriesNumberGuide from './series-number-guide';
import { getPersonaUserInfo, uploadUserImage } from '../../services/personal-center';
import { RESPONSIVE_THRESHOLD } from '../../models/common/sys-msg';
import EditableTagGroup from './editable-tag-group';
import { USER_PROFILE } from '../../models/common/sys-msg';
import '../../styles/login.scss';

export default function Register() {
    const [industries, setIndustries] = useState<CommonBaseModel[]>([]);
    const [location, setLocation] = useState<LocationModel[]>([]);
    const [checkAcceptInfo, setCheckAcceptInfo] = useState<boolean>(false);
    const [checkDataProtect, setCheckDataProtect] = useState<boolean>(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const routeLocation = useLocation();
    const isRegister : boolean = routeLocation.state === null;
    const [personalInfo, setPersonalInfo] = useState<UserModel>(routeLocation.state)
    const [bussinessTypes, setBussinessTypes] = useState<CommonBaseModel[]>([]);
    const [currentBusinessType, setCurrentBussinessType] = useState<string>();
    const [formChanged, setFormChanged] = useState<boolean>(false);
    const [currentIndustryType, setCurrentIndustryType] = useState<string>();
    const isResponsive = window.screen.width < RESPONSIVE_THRESHOLD;
    const [loading, setLoading] = useState<boolean>(false);
    const [isSNModalVisible, setIsSNModalVisible] = useState<boolean>(false);
    const [sns, setSns] = useState<string[]>([]);
    const [avatar, setAvatar] = useState<string>(personalInfo?.weChatImagePath ?? '');
    const [avatarLoading, setAvatarLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getIndustries().then(industry => {
            setIndustries(industry);
            if(!isRegister){
                let other = industry.find(item => item.name.includes('其他'));
                getPersonaUserInfo().then(result => {
                    setPersonalInfo(result);
                    form.setFieldsValue({
                        name: result.name,
                        phoneNumber: result.phoneNumber,
                        email: result.email,
                        company: result.company,
                        jobTitle: result.jobTitle,
                        industryID: result.industry?.id ?? other?.id,
                        seriesNumbers: result.seriesNumbers,
                        location: result.province ? [result.province?.id, result.city?.id] : null,
                        businessTypeID: result.businessType?.id,
                        industryText: result.industryText,
                        college: result.college,
                        technicalOffice: result.technicalOffice,
                        department: result.department
                    })
                    setSns(result.seriesNumbers?.split(',').filter(item => item.trim().length > 0));
                    if(result.industry){
                        setCurrentIndustryType(industry.find(item => item.id === personalInfo.industry?.id)?.name);
                    }else{
                        setCurrentIndustryType(other?.name);
                    }
                    setLoading(false);
                })
            }else{
                setLoading(false);
            }
        });

        getProvince().then(result => {
            let loc : LocationModel[] = result?.map((province: ProvinceModel) => {
                return {
                    value: province.id,
                    label: province.name,
                    children: province.cities.map((city: CityModel) => {
                        return {
                            value: city.id,
                            label: city.name,
                            children: city.districts?.map((district: CommonBaseModel) => {
                                return {
                                    value: district.id,
                                    label: district.name
                                }
                            })
                        }
                    })
                }
            })
            setLocation(loc);
        });
        getBussinessType().then(result => {
            setBussinessTypes(result);
            !isRegister && setCurrentBussinessType(result.find(item => item.id === personalInfo.businessType?.id)?.name);
        })
    }, [])

    // 修改用户信息时，验证用户信息
    const validateUserInfo = (values: any) => {
        if(!isRegister){
            if(!values.name?.trim().length){
                message.destroy();
                message.warn('请输入用户名');
                return false;
            }
            else if(!values.phoneNumber?.trim().length){
                message.destroy();
                message.warn('请输入手机号');
                return false;
            }
            else if(!new RegExp(/^1(3|4|5|7|8|9)\d{9}$/).test(values.phoneNumber?.trim())){
                message.destroy();
                message.warn('请输入合法手机号');
                return false;
            }
            else if(!values.email?.trim().length){
                message.destroy();
                message.warn('请输入邮箱');
                return false;
            }
            else if(!new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g).test(values.email?.trim())){
                message.destroy();
                message.warn('请输入合法邮箱');
                return false;
            }
            else if(!values.jobTitle?.trim().length){
                message.destroy();
                message.warn('请输入职称');
                return false;
            }
            else if(!values.businessTypeID?.trim().length){
                message.destroy();
                message.warn('请选择企业类型');
                return false;
            }
            else if(!values.company?.trim().length){
                message.destroy();
                message.warn('请输入单位');
                return false;
            }
            else if(currentBusinessType === '科研机构' && !values.college?.trim().length){
                message.destroy();
                message.warn('请输入学院/课题组');
                return false;
            }
            else if(currentBusinessType === '医院' && !values.technicalOffice?.trim().length){
                message.destroy();
                message.warn('请输入科室');
                return false;
            }
            else if(currentBusinessType?.startsWith('工业') && !values.department?.trim().length){
                message.destroy();
                message.warn('请输入部门');
                return false;
            }
            else if(values?.industryID.trim().length <= 0){
                message.destroy();
                message.warn('请选择行业');
                return false;
            }
            else if(currentIndustryType?.includes('其他') && !values.industryText?.trim().length){
                message.destroy();
                message.warn('请输入行业');
                return false;
            }
            else if(!values.location?.length){
                message.destroy();
                message.warn('请选择区域');
                return false;
            }
            else{
                return true;
            }
        }else{
            return true;
        }
    }

    const handleRegister = (values: any) => {
        let isValid = validateUserInfo(values);
        setFormChanged(false);
        isValid && form.validateFields().then((formdata: any) => {
            if((isRegister && checkAcceptInfo && checkDataProtect) || !isRegister){
                let data : UserRegisterModel = {
                    ...formdata,
                    name: formdata.name?.trim(),
                    email: formdata.email?.trim(),
                    jobTitle: formdata.jobTitle?.trim(),
                    company: formdata.company?.trim(),
                    college: formdata.college?.trim(),
                    technicalOffice: formdata.technicalOffice?.trim(),
                    department: formdata.department?.trim(),
                    provinceId: formdata.location[0],
                    cityId: formdata.location[1],
                    districtId: formdata.location[2],
                    seriesNumbers: formdata.seriesNumbers,
                    weChatImagePath: isRegister ? '' : avatar,
                    industryID: currentIndustryType?.includes('其他') ? null : formdata.industryID,
                    industryText: currentIndustryType?.includes('其他') ? formdata.industryText?.trim() : null
                }
                userRegister(data).then(result => {
                    message.destroy();
                    if(result){
                        if(isRegister){
                            message.success('注册成功');
                            navigate('/home');
                        }else{
                            message.success('信息修改成功');
                            navigate('/personalCenter');
                        }
                    }else{
                        if(isRegister){
                            message.warn('注册失败，请稍后再试');
                        }else{
                            message.warn('信息修改失败，请稍后再试');
                        }
                    }
                })
            }else{
                message.destroy();
                message.warning('未同意声明');
            }
        })
    }

    const handleCheckAcceptInfo = (e: any) => {
        setCheckAcceptInfo(e.target.checked);
    }

    const handleCheckDataProtect = (e: any) => {
        setCheckDataProtect(e.target.checked);
    }

    const handleBusinessTypeChange = (value: any) => {
        if(value){
            setCurrentBussinessType(bussinessTypes.find(item => item.id === value)?.name);
        }
        setFormChanged(true);
    }

    const handleFormChange = (e: any) => {
        setFormChanged(true);
    }

    const handleIndustryTypeChange = (value: any) => {
        if(value){
            setCurrentIndustryType(industries.find(item => item.id === value)?.name);
        }
        setFormChanged(true);
    }

    const handleSNCancel = () => {
        setIsSNModalVisible(false);
    }

    const handleUpdateSN = (e: any) => {
        e.stopPropagation();
        setIsSNModalVisible(true);
    }

    const handleSetSns = (value: string[]) => {
        setSns(value);
        form.setFieldsValue({seriesNumbers: value.join(',')})
        setFormChanged(true);
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

    const handleAvatarClick = () => {
        document.getElementById('avatar_file')?.click();
    }

    const handleAvatarChange = (e: any) => {
        if(e.target.files.length > 0){
            setAvatarLoading(true);
            uploadUserImage(e.target.files[0]).then(response => {
                if(response.length > 0){
                    setAvatar(response[0].contentPath);
                }
                setAvatarLoading(false);
            })
        }
    }

    return (
        <div className={isRegister ? 'main_view_register' : 'main_view'}>
        {
        loading ? <div className='nodata'><Spin /></div> :
        <>
        {isRegister && <div>用户注册</div>}
        <Form
            form={form}
            name='register'
            layout='horizontal'
            onFinish={handleRegister}
            labelCol={{span: 12}}
            wrapperCol={{span: 12}}
            onChange={handleFormChange}
            >
            <Form.Item label='头像'>
                {avatarLoading ? <Spin/> : <img width={34} height={34} src={avatar} onClick={handleAvatarClick}/>}
                <input type="file" id="avatar_file" style={{display: 'none'}} accept='.jpg,.jpeg,.png' onChange={handleAvatarChange}/>
            </Form.Item>
            <Form.Item label='用户名' name='name' rules={isRegister ? [{ required: true }, { whitespace: true }] : []}>
                <Input placeholder='请输入用户名' bordered={false}/>
            </Form.Item>
            <Form.Item label='手机号' name='phoneNumber' rules={isRegister ? [{ required: true }, {whitespace: true}, {pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g), message: '请输入合法手机号'}] : []}>
                <Input placeholder='请输入手机号' bordered={false}/>
            </Form.Item>
            <Form.Item label='邮箱' name='email' rules={isRegister ? [{ required: true }, {whitespace: true}, {type: 'email' }] : []}>
                <Input placeholder='请输入邮箱' bordered={false}/>
            </Form.Item>
            <Form.Item label='职称' name='jobTitle' rules={isRegister ? [{ required: true }, {whitespace: true}] : []}>
                <Input placeholder='请输入职称' bordered={false}/>
            </Form.Item>
            <Form.Item label='企业类型' name='businessTypeID' rules={isRegister ? [{ required: true }] : []}>
                <Select placeholder='请选择企业类型' onChange={handleBusinessTypeChange} bordered={false}>
                    {
                        bussinessTypes.map((item: CommonBaseModel) => {
                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item label='单位' name='company' rules={isRegister ? [{ required: true }, {whitespace: true}] : []}>
                <Input placeholder='请输入单位' bordered={false}/>
            </Form.Item>
            {currentBusinessType === '科研机构' && <Form.Item label='学院/课题组' name='college' rules={isRegister ? [{ required: currentBusinessType === '科研机构' }, {whitespace: true}] : []}>
                <Input placeholder='请输入学院/课题组' bordered={false}/>
            </Form.Item>}
            {currentBusinessType === '医院' && <Form.Item label='科室' name='technicalOffice' rules={isRegister ? [{ required: currentBusinessType === '医院' }, {whitespace: true}] : []}>
                <Input placeholder='请输入科室' bordered={false}/>
            </Form.Item>}
            {currentBusinessType?.startsWith('工业') && <Form.Item label='部门' name='department' rules={isRegister ? [{ required: currentBusinessType?.startsWith('工业') }, {whitespace: true}] : []}>
                <Input placeholder='请输入部门' bordered={false}/>
            </Form.Item>}
            <Form.Item label='设备序列（SN）号' name='seriesNumbers'  >
                <Input placeholder='请输入设备SN号' onClick={handleUpdateSN} autoComplete='off' bordered={false}/>
            </Form.Item>
            <Form.Item label='所属行业' name='industryID' rules={isRegister ? [{ required: true }] : []}>
                <Select placeholder='请选择行业' onChange={handleIndustryTypeChange} bordered={false}>
                {
                    industries.map((item: CommonBaseModel) => {
                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })
                }
                </Select>
            </Form.Item>
            {currentIndustryType?.includes('其他') && <Form.Item label='其它行业' name='industryText' rules={isRegister ? [{ required: currentIndustryType?.startsWith('其他') }, {whitespace: true}] : []}>
                <Input placeholder='请输入行业' bordered={false}/>
            </Form.Item>}
            <Form.Item label='区域' name='location' rules={ isRegister ? [{ required: true }] : []}>
                <Cascader options={location} onChange={handleFormChange} bordered={false} placeholder='请选择区域'/>
            </Form.Item>
            {   isRegister &&
                <>
                <div className='defineCard'>
                    <Checkbox onChange={handleCheckAcceptInfo}>是的，我希望继续成为该营销邮件的忠实读者，并接收有关蔡司显微镜产品和服务的新闻及信息。</Checkbox>
                </div>
                <div className='defineCard'>
                    <Checkbox onChange={handleCheckDataProtect}>我已阅读并接受<a target='_blank' href='https://www.zeiss.com.cn/data-protection/home.html?vaURL=www.zeiss.com.cn/data-protection'>《数据保护声明》</a></Checkbox>
                </div>
                </>
            }
            <Button type='primary' htmlType='submit' disabled={!formChanged} >{!isRegister ? '保存' : '注册'}</Button>
            {
                !isRegister && isResponsive &&
                <Button type='primary' onClick={handleUserLogout} >退出当前账户</Button>
            }
        </Form>
            </>
            }
            <Modal 
                title={<SeriesNumberGuide/>}
                visible={isSNModalVisible} 
                onCancel={handleSNCancel}
                destroyOnClose
                footer={[]}
                >
                    <EditableTagGroup datas={sns} callback={handleSetSns} needToDB={false}/>
            </Modal>
        </div>
    )
}
