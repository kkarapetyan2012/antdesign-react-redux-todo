import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleComplete, deleteTodo, editTodo } from '../features/todos/todosSlice';
import { Formik, Form, Field, FormikHelpers, FieldProps  } from 'formik';
import * as Yup from 'yup';
import { Input, Button, DatePicker, List, Typography, Row, Col, Space } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styles from './TodoItem.module.css';

interface Todo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  overdue?: boolean;
}

interface TodoFormValues {
  title: string;
  description: string;
  deadline: moment.Moment | null;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  deadline: Yup.date().required('Deadline is required').nullable(),
});

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleComplete = () => {
    dispatch(toggleComplete({ id: todo.id }));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (values: TodoFormValues, { resetForm }: FormikHelpers<TodoFormValues>) => {
    dispatch(editTodo({
      id: todo.id,
      title: values.title,
      description: values.description,
      deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
      completed: todo.completed,
      overdue: todo.overdue,
    }));
    setIsEditing(false);
    resetForm();
  };

  return (
    <List.Item
      className={styles.todoItem}
      style={{padding: 0}}
      actions={[
        !todo.overdue && (
          <Typography.Link onClick={handleToggleComplete}>
            {!isEditing && (todo.completed ? 'Did' : 'Done')}
          </Typography.Link>
        ),
        (!todo.completed && !isEditing) && (
          <Space className={styles.todoItemActions}>
            <Button onClick={handleDelete} danger>
              Delete
            </Button>
            <Button onClick={handleEdit}>
              Edit
            </Button>
          </Space>
        )
      ]}
    >
      {isEditing ? (
        // Form for editing the todo
        <Formik
          initialValues={{
            title: todo.title,
            description: todo.description,
            deadline: todo.deadline ? moment(todo.deadline, 'YYYY-MM-DD') : null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ setFieldValue }) => (
            <Form style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col sm={24} style={{marginBlock: 8}}>
                  <Field name="title" as={Input} placeholder="Title" />
                </Col>
                <Col sm={24} style={{marginBlock: 8}}>
                  <Field name="description" as={Input.TextArea} placeholder="Description" rows={4} />
                </Col>
                <Col sm={24} style={{marginBlock: 8}}>
                  <Field name="deadline">
                    {({ field }: FieldProps) => (
                      <DatePicker
                        format="YYYY-MM-DD"
                        value={field.value}
                        onChange={(date) => {
                          setFieldValue('deadline', date);
                        }}
                      />
                    )}
                  </Field>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit" style={{ marginTop: 12 }}>
                Save
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        // Display view of the todo
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Typography.Text>
              <Link to={`/todo/${todo.id}`}>
                {todo.title}
              </Link>
            </Typography.Text>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Typography.Text style={{ color: todo.overdue ? 'red' : todo.completed ? 'green' : 'black' }}>
              {todo.description}
            </Typography.Text>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Typography.Text>
              {todo.deadline} - {todo.completed ? 'Completed' : 'Incomplete'}
              {todo.overdue && <Typography.Text type="danger"> - Overdue</Typography.Text>}
            </Typography.Text>
          </Col>
        </Row>
      )}
    </List.Item>
  );
}

export default TodoItem;
