import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectTodoById } from '../features/todos/todosSlice';
import { Button, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

const { Title, Text } = Typography;

const TodoDetails: React.FC = () => {
  const history = useNavigate();
  const { id } = useParams<{ id: string }>();
  const todo = useSelector((state: RootState) => id ? selectTodoById(state, id) : undefined);

  const handleButtonClick = () => {
    history('/');
  };

  if (!todo) {
    return <Text>Todo not found.</Text>;
  }

  return (
    <Card style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
      <Button onClick={handleButtonClick} style={{ marginBottom: '20px' }}>Back</Button>
      <div>
        <Title level={2}>Todo Details</Title>
        <p><Text strong>ID:</Text> {todo.id}</p>
        <p><Text strong>Title:</Text> {todo.title}</p>
        <p><Text strong>Description:</Text> {todo.description}</p>
        <p><Text strong>Deadline:</Text> {todo.deadline}</p>
        <p>
          <Text strong>Status:</Text> {todo.completed ? 'Completed' : 'Incomplete'} - 
          {todo.overdue && <Text type="danger"> Overdue</Text>}
        </p>
      </div>
    </Card>
  );
};

export default TodoDetails;
