import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { loginValidator } from '@/lib/validators';

export default function useLoginForm() {
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
            await loginValidator.validate(formData, { abortEarly: false });

            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (res.ok) {
                toast.success('Login successful');
                router.push('/dashboard');
            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            toast.error('Validation failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, handleChange, handleSubmit };
}
