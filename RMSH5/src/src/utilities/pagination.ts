import { PaginationProps } from 'antd/lib/pagination';

export const paginationConfig = (total: number, current: number, onChange: (page: number, pageSize?: number) => void) => {
    let config : PaginationProps = {
        total,
        pageSize: 12,
        current,
        hideOnSinglePage: true,
        responsive: true,
        showTotal: (total) => `共${total}项`,
        onChange
    }
    return config;
}