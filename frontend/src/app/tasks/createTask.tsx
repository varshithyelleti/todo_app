'use client';

import { CreateTaskDetails, useTaskService } from '@/src/services/useTaskService';
import { snakeCaseToTitleCase } from '@/src/utils/helper';
import { HTTP_STATUS, TASK_STATUS } from '@/src/utils/type';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Task } from './page';
import { useEffect, useState } from 'react';

interface UpsertTaskProps {
  onCreate: (task: Task | null) => void;
  mode: boolean;
  details: Task | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.mixed<TASK_STATUS>().oneOf(Object.values(TASK_STATUS), 'Invalid status').required('Status is required'),
});

export default function CreateForm({ onCreate, mode, details }: UpsertTaskProps) {
  const { createTask, updateTask } = useTaskService();

  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
  });

  useEffect(() => {
    if (details) {
      setInitialValues({
        title: details.title || '',
        description: details.description || '',
        status: details.status || TASK_STATUS.TODO,
      });
    } else {
      setInitialValues({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
      });
    }
  }, [details]);
  
  const handleSubmit = async (values: { title: string; description: string; status: TASK_STATUS }, { resetForm }: { resetForm: () => void }) => {
    const upsertTaskDetails: CreateTaskDetails = {
      ...values,
      startDateTime: new Date(),
      endDataTime: new Date(),
    };
    let response = null;
    if (mode) {
      response = await createTask(upsertTaskDetails);
      if (response.data.status === HTTP_STATUS.CREATED) {
        onCreate(response.data.data);
      }
    } else {
      if (!details?.id) return;
      response = await updateTask(details.id, upsertTaskDetails);
      if (response.data.status === HTTP_STATUS.OK) {
        onCreate(response.data.data);
      }
    }
    resetForm();
  };

  return (
    <div className="container mx-auto mb-4 w-1/2">
      <h2 className="text-lg font-bold">{mode ? 'Create Task' : 'Update Task'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setValues }) => {
          useEffect(() => {
            if (!mode && details) {
              setValues({
                title: details.title || '',
                description: details.description || '',
                status: details.status || TASK_STATUS.TODO,
              });
            }
          }, [mode, details, setValues]);

          return (
            <Form>
              <div className="mb-2">
                <label className="block">Title:</label>
                <Field
                  type="text"
                  name="title"
                  className="border rounded p-1 w-full"
                  placeholder="Enter task title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-2">
                <label className="block">Description:</label>
                <Field
                  as="textarea"
                  name="description"
                  className="border rounded p-1 w-full"
                  placeholder="Enter task description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-2">
                <label className="block">Status:</label>
                <Field as="select" name="status" className="border rounded p-1 w-full">
                  <option value="">Select status</option>
                  {Object.values(TASK_STATUS).map((task_status) => (
                    <option key={task_status} value={task_status}>
                      {snakeCaseToTitleCase(task_status)}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {mode ? 'Create' : 'Update'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}