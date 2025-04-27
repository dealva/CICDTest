
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { registerValidator } from '@/lib/validators';

export default function useRegisterForm() {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Registration failed');

            toast.success('Registration successful! Logging you in...');

            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result.ok) {
                router.push('/dashboard');
            } else {
                toast.error('Login failed after registration.');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, handleChange, handleSubmit };
}
