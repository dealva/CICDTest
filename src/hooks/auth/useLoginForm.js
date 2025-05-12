'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { loginValidator } from '@/lib/validators';
import { useReCaptcha } from 'next-recaptcha-v3';

export default function useLoginForm() {
    const { executeRecaptcha } = useReCaptcha();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
 
          const token = await executeRecaptcha('login');
          await loginValidator.validate(formData, { abortEarly: false });
    
      
          const res = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
            recaptchaToken: token,
          });
      
          console.log("Login response:", res);
      
          if (res?.ok) {
            toast.success("Login successful");
            // router.push('/dashboard');  
            // console.log('Current path:', router.pathname);
            //     if (router.pathname !== '/dashboard') {
            //         router.push('/dashboard');  
            // }
            window.location.href = "/dashboard";
    
            
          } else {
            toast.error(res?.error || "Login failed");
          }
        } catch (err) {
          toast.error(err || "Validation or CSRF error");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      

    return { formData, loading, handleChange, handleSubmit };
}
