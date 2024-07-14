import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, selectFilter, FilterType } from '../features/todos/todosSlice';
import { Button, Space } from 'antd';
import { RootState } from '../store';

const Filter: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector<RootState, FilterType>(selectFilter);

  return (
    <div style={{marginBottom: 16}}>
      <Space>
        {(['all', 'completed', 'incomplete', 'overdue'] as FilterType[]).map((filter) => (
          <Button
            key={filter}
            type={currentFilter === filter ? 'primary' : 'default'}  // Highlight the active filter
            onClick={() => dispatch(setFilter(filter))}
            disabled={currentFilter === filter}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </Space>
    </div>
  );
}

export default Filter;

