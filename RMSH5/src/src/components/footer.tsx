import React from 'react';
import { Layout } from 'antd';
import { useSearchParams } from 'react-router-dom';

export default function Footer() {
    const [search] = useSearchParams();
    const isLessonDetail = search.get('p');
    return (
        isLessonDetail ?
        <Layout.Footer>
            蔡司版权所有 不得擅自翻录，违者必究
        </Layout.Footer> : <></>
    )
}
