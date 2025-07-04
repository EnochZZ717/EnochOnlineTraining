import React, { useState, useEffect } from 'react'
import { List, Checkbox, Button, Space, Modal, Radio, RadioChangeEvent, Image } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getCourseExam, getExamResult } from '../../services/operation-guide';
import { CourseExamModel, QuestionOptionModel } from '../../models/operation-guide';
import '../../styles/azureLessons.scss'

export default function ExamDetail() {
    const [showAnwser, setShowAnwser] = useState(false);
    const [fail, setFail] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [exam, setExam] = useState<CourseExamModel>();
    const [selectAnwserMap, ] = useState(new Map<string, string[]>());
    const [enableSubmit, setEnableSubmit] = useState<boolean>(false);

    useEffect(() => {
        getCourseExam(params.id ?? '').then(result => {
            setExam(result);
        })
    }, [])
    
    const handleExamSubmit = () => {
        let questions : {questionId: string, optionIds: string[]}[] = [];
        selectAnwserMap.forEach((value, key) => {
            questions = [...questions, {questionId: key, optionIds: value}]
        });
        let examRequest = {
            courseId: params.id ?? '',
            questions
        }

        getExamResult(examRequest).then(result => {
            if(result.result === 'Failed'){
                setFail(true);
            }else{
                setFail(false);
            }

            Modal.info({
                icon: false,
                className: 'textCenter',
                content: result.result !== 'Failed' ? <><div>恭喜您通过测试分数为：{result.point}</div><Image preview={false} src='/assets/images/flower.png' alt='pass'/></> : "很遗憾您没有通过测试",
                okText: result.result === 'Failed' ? "查看答案" : false,
                onOk: result.result === 'Failed' ? () => {
                    setShowAnwser(true);
                  } : () => {navigate(`/operationGuide/${params.id}`)},
                closable: true,
                cancelText: false
            })
        })

        setEnableSubmit(false);
    }

    const handleSingleSelectAnwserChange = (e: RadioChangeEvent) => {
        selectAnwserMap.set(e.target.name!, [e.target.value]);
        if(selectAnwserMap.size > 0){
            setEnableSubmit(true);
        }
    }

    const handleMultiSelectAnwserChange = (id: string, values: any) => {
        selectAnwserMap.set(id, values);
        if(selectAnwserMap.size > 0){
            setEnableSubmit(true);
        }
    }

    return (
        <>
            <div className='itemTop'>{exam?.title}</div>
            <Image src={exam?.imagePath} width='100%' preview={false}/>
            <div>{exam?.description}</div>
            <List
                    itemLayout="horizontal"
                    dataSource={exam?.questions}
                    renderItem={(item, index )=> (
                    <List.Item
                    key={item.id}
                    >
                        <List.Item.Meta
                        title={<>{index+1}.{item.stem} {item.type === '多选' ? '(多选题) ' : ''} 
                        {(showAnwser && selectAnwserMap.get(item.id)) && 
                            (item.type === '多选' ? selectAnwserMap.get(item.id)?.length !== item.answers.length || !selectAnwserMap.get(item.id)?.map(anw => item.answers.map(a => a.id).includes(anw)).includes(false)
                            : !item.answers.map(item => {return item.id}).includes(selectAnwserMap.get(item.id)![0])) && <span style={{color: '#008BD0', fontWeight: 600}}>不正确</span>}</>}
                        description={
                            item.type === '单选' ? 
                            (<Radio.Group onChange={handleSingleSelectAnwserChange} name={item.id}>
                                {item.questionOptions.map((option: QuestionOptionModel) => {
                                    let incorrectImg = option.id === item.answers[0].id ? '/assets/images/correct.png' : '/assets/images/incorrect.png';
                                    return (
                                        <div key={option.id} className='detail-space'>
                                         {
                                             showAnwser && ((selectAnwserMap.get(item.id) && !item.answers.map(item => {return item.id}).includes(selectAnwserMap.get(item.id)![0])) || !selectAnwserMap.get(item.id)) && <Image src={incorrectImg} preview={false} width={15}/>
                                         }
                                         <Radio value={option.id} key={option.id}><span>{option.optionContent}</span></Radio>
                                        </div>  
                                    )
                                })}
                            </Radio.Group>)
                                :
                                (<Checkbox.Group onChange={(checkedValues) => handleMultiSelectAnwserChange(item.id, checkedValues)} name={item.id}>
                                    {
                                        item.questionOptions.map((option: QuestionOptionModel) => {
                                            let incorrectImg = item.answers.map(item => {return item.id}).includes(option.id) ? '/assets/images/correct.png' : '/assets/images/incorrect.png';
                                            return (
                                            <div key={option.id} className='detail-space'>
                                                {
                                                    showAnwser && (selectAnwserMap.get(item.id)?.length !== item.answers.length || selectAnwserMap.get(item.id)?.map(anw => item.answers.map(a => a.id).includes(anw)).includes(false)) && <Image src={incorrectImg} preview={false} width={15}/>
                                                }
                                                <Checkbox value={option.id} key={option.id}><span>{option.optionContent}</span></Checkbox>
                                            </div>)
                                        })
                                    }
                                </Checkbox.Group>
                                )
                        }
                    />
                    </List.Item>
                )}/>
            {fail ? (
            <Space>
                <Button type='primary' onClick={() => {window.location.reload()}}>重新测试</Button>
                <Button type='primary' onClick={() => {navigate(location.pathname.substr(0, location.pathname.lastIndexOf('/')))}}>返回</Button>
            </Space>) :
            <Button type='primary' onClick={handleExamSubmit} disabled={!enableSubmit}>提交</Button>}
        </>
    )
}
