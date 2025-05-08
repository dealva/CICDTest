
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { registerValidator } from '@/lib/validators';
import useCsrfToken from './useCsrfToken';
// import { useCsrfToken } from '@/contexts/csrf-token/client';
export default function useRegisterForm() {
    const csrfToken = useCsrfToken();
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
            await registerValidator.validate(formData, { abortEarly: false });


            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','X-CSRF-Token': csrfToken }, 
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Registration failed');

            toast.success('Registration successful!');
            
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });
            console.log('SignIn Response:', result); // Log the full response
    
            if (result.ok) {
                toast.success('Redirect to dashboard...');
                // router.push('/dashboard');
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
