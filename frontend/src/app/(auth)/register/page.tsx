'use client';

import React, { use, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RegisterDetails, useAuthenticationService } from '@/src/services/useAuthenticationService';
import { GENDER_TYPE, HTTP_STATUS } from '@/src/utils/type';
import { AuthenticatedUserContext, AuthenticatedUserType } from '@/src/contexts/AuthenticatedUserContext';
import { useRouter } from 'next/navigation';
import { snakeCaseToTitleCase } from '@/src/utils/helper';

interface UserFormValues {
  name: string;
  mobileNumber: string;
  gender: GENDER_TYPE | GENDER_TYPE.OTHER;
  country?: string;
  hobbies?: string;
  email: string;
  password: string;
}

const initialValues: UserFormValues = {
  name: '',
  mobileNumber: '',
  gender: GENDER_TYPE.OTHER,
  country: '',
  hobbies: '',
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  name: Yup.string().min(3).max(100).required('Name is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  gender: Yup.mixed<GENDER_TYPE>().oneOf(Object.values(GENDER_TYPE), 'Invalid gender').required('Gender is required'),
  country: Yup.string().min(3).max(100),
  hobbies: Yup.string().min(3).max(100),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Register = () => {

  const { register } = useAuthenticationService();
  const { handleAuthenticationDetails, user } = useContext(AuthenticatedUserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const registerData: RegisterDetails = {
        name: values.name,
        mobileNumber: values.mobileNumber,
        gender: values.gender ?? GENDER_TYPE.OTHER,
        country: values.country,
        hobbies: values.hobbies,
        email: values.email,
        password:values.password
      }
      const response = await register(registerData);
      if (response?.data?.status === HTTP_STATUS.CREATED) {
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
        alert("Mobile number or Email is already registered");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="container mx-auto p-4 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <Field name="name" id="name" className="border rounded p-2 w-full" />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
            <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
            <Field as="select" name="gender" id="gender" className="border rounded p-2 w-full">
              <option value="">Select Gender</option>
              {Object.values(GENDER_TYPE).map((gender) => (
                <option key={gender} value={gender}>
                  {snakeCaseToTitleCase(gender)} 
                </option>
              ))}
            </Field>
            <ErrorMessage name="gender" component="div" className="text-red-600 text-sm" />
          </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium">Mobile Number</label>
              <Field name="mobileNumber" id="mobileNumber" className="border rounded p-2 w-full" />
              <ErrorMessage name="mobileNumber" component="div" className="text-red-600 text-sm" />
            </div>


            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Field name="email" id="email" type="email" className="border rounded p-2 w-full" />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Field name="password" id="password" type="password" className="border rounded p-2 w-full" />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium">Country</label>
              <Field name="country" id="country" className="border rounded p-2 w-full" />
              <ErrorMessage name="country" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label htmlFor="hobbies" className="block text-sm font-medium">Hobbies</label>
              <Field name="hobbies" id="hobbies" className="border rounded p-2 w-full" />
              <ErrorMessage name="hobbies" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
            <div>
            </div>
          </Form>
        )}
      </Formik>
      <button
        type="button"
        className="text-blue rounded w-full"
        onClick={() => router.push("/login")}
      >
        Sign in
      </button>
    </div>
  );
};

export default Register;
