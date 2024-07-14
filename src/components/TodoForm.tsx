import React from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todos/todosSlice';
import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import styles from './TodoForm.module.css'; // Import the CSS module

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  deadline: Yup.date().required('Deadline is required').nullable(),
});

interface FormValues {
  title: string;
  description: string;
  deadline: string;
}

const TodoForm: React.FC = () => {
  const dispatch = useDispatch();

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    dispatch(addTodo({
      id: uuidv4(),
      title: values.title,
      description: values.description,
      deadline: values.deadline,
      completed: false,
      overdue: false,
    }));

    resetForm();
  };

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        deadline: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <Field name="title">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  placeholder="Title"
                  status={touched.title && errors.title ? 'error' : ''}
                />
              )}
            </Field>
            {touched.title && errors.title && <div className={styles.errorMessage}>{errors.title}</div>}
          </div>

          <div className={styles.formField}>
            <Field name="description">
              {({ field }: FieldProps) => (
                <Input.TextArea
                  {...field}
                  placeholder="Description"
                  rows={4}
                  status={touched.description && errors.description ? 'error' : ''}
                />
              )}
            </Field>
            {touched.description && errors.description && <div className={styles.errorMessage}>{errors.description}</div>}
          </div>

          <div className={styles.formField}>
            <Field name="deadline">
              {({ field, form }: FieldProps) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Deadline"
                  value={field.value ? moment(field.value) : null}
                  onChange={(date, dateString) => {
                    console.log(date);
                    form.setFieldValue(field.name, dateString);
                  }}
                  status={touched.deadline && errors.deadline ? 'error' : ''}
                />
              )}
            </Field>
            {touched.deadline && errors.deadline && <div className={styles.errorMessage}>{errors.deadline}</div>}
          </div>

          <Button type="primary" htmlType="submit" style={{ marginBottom: 16 }}>
            Add Todo
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default TodoForm;
