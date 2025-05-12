'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { registerValidator } from '@/lib/validators';
import { useCsrfToken } from '@/contexts/csrf-token/client';
import { useReCaptcha } from 'next-recaptcha-v3';


export default function useRegisterForm() {
    const csrfToken = useCsrfToken();
    const { executeRecaptcha } = useReCaptcha();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await executeRecaptcha('register');



            await registerValidator.validate(formData, { abortEarly: false });
            

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','X-CSRF-Token': csrfToken }, 
                body: JSON.stringify({...formData,recaptchaToken: token}), 
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Registration failed');

            toast.success('Registration successful!');
            
            const loginToken = await executeRecaptcha('login'); // New reCAPTCHA token for login

            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
                recaptchaToken: loginToken, // Pass the token
            });
            console.log('SignIn Response:', result); // Log the full response
    
            if (result.ok) {
                toast.success('Redirect to dashboard...');
                // router.push('/dashboard');
                // window.location.href = "/dashboard";
                // console.log('Current path:', router.pathname);
                // if (router.pathname !== '/dashboard') {
                //     router.push('/dashboard');  
                // }
                window.location.href = "/dashboard";
            } else {
                toast.error('Login failed after registration.');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, handleChange, handleSubmit , csrfToken  };
}
