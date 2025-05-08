'use client';

import TextInput from '@/components/common/form/TextInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import FormHeader from '@/components/common/form/FormHeader';
import RedirectPrompt from '@/components/common/form/RedirectPrompt';
import useLoginForm from '@/hooks/auth/useLoginForm';
// import { useEffect, useState } from 'react';

export default function LoginForm ()  {
    const { formData, loading, handleChange, handleSubmit, csrfToken } = useLoginForm();
    // const [formValues, setFormValues] = useState(formData);

    // useEffect(() => {
    //   // Sync form values with formData after the first render
    //   setFormValues(formData);
    // }, [formData]);
//   const handleGoogleLogin = async () => {
//     await signIn('google');
//   };

  return (
    <div className="max-w-md mx-auto p-4">
        <FormHeader title="Login" />
        <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
                type="hidden"
                value={csrfToken}
                name="csrfToken"
            />
            <TextInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <TextInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <SubmitButton 
                loading={loading} 
                text="Login" 
            />

        </form>
        {/* <hr className="my-4" /> */}
        {/* <button
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 bg-red-500 text-white rounded"
        >
            Login with Google
        </button> */}

        <RedirectPrompt 
            message="Don't have an account yet?" 
            linkText="Register here" 
            href="/register" 
        />
    </div>
  );
};


