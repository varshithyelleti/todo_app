'use client';

import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoginDetails, useAuthenticationService } from '@/src/services/useAuthenticationService';
import { HTTP_STATUS } from '@/src/utils/type';
import { useRouter } from 'next/navigation';
import { AuthenticatedUserContext, AuthenticatedUserType } from '@/src/contexts/AuthenticatedUserContext';


interface UserFormValues {
  mobileNumber: string;
  password: string;
}

const initialValues: UserFormValues = {
  mobileNumber: '',
  password: '',
};

const validationSchema = Yup.object({
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Login = () => {

  const { login } = useAuthenticationService();
  const { handleAuthenticationDetails } = useContext(AuthenticatedUserContext);
  const router = useRouter();
  const handleSubmit = async (values: UserFormValues, { resetForm }: { resetForm: () => void }) => {
    try {
      const loginData: LoginDetails = {
        mobileNumber: values.mobileNumber,
        password:values.password
      }
      const response = await login(loginData);
      if (response?.data?.status === HTTP_STATUS.OK) {
        const { user, token } = response?.data?.data ?? {};
        if (user && token) {
          localStorage.setItem("user", token);
          const userContext: AuthenticatedUserType = {
                    id: user.id,
                    fullName: user.name,
                    mobileNumber: user.mobileNumber,
                    email: user.email,
                    token: user.token
                  }
          handleAuthenticationDetails(userContext)
          router.push('/tasks');
        } else {
          console.error("User or token is missing in the response:", response.data);
        }
      } else {
        console.error("Unexpected response status:", response?.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="container mx-auto p-4 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium">Mobile Number</label>
              <Field name="mobileNumber" id="mobileNumber" className="border rounded p-2 w-full" />
              <ErrorMessage name="mobileNumber" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Field name="password" id="password" type="password" className="border rounded p-2 w-full" />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Login'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <button
        type="button"
        className="text-blue rounded w-full mt-2"
        onClick={() => router.push("/register")}
      >
        Register
      </button>

    </div>
  );
};

export default Login;
