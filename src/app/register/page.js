import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/auth/layout/AuthLayout';
import { metadataConfig } from '@/lib/metadata';

export const metadata = metadataConfig.register;

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
