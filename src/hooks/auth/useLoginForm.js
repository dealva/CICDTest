import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { loginValidator } from '@/lib/validators';
import useCsrfToken from './useCsrfToken';

export default function useLoginForm() {
    const csrfToken = useCsrfToken();
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
    
      
          const res = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
      
          console.log("Login response:", res);
      
          if (res?.ok) {
            toast.success("Login successful");
    
            // router.push("/dashboard");
            window.location.href = "/dashboard";
    
            
          } else {
            toast.error(res?.error || "Login failed");
          }
        } catch (err) {
          toast.error("Validation or CSRF error");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      

    return { formData, loading, handleChange, handleSubmit, csrfToken };
}
