import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/auth/layout/AuthLayout';
// import { cookies } from 'next/headers';
import ServerProvider from '@/contexts/csrf-token/server';

export default function RegisterPage() {
  // const nonce = cookies().get('nonce')?.value;

  return (
    <>
      {/* <script nonce={nonce} src="https://www.google.com/recaptcha/api.js?render=your-site-key" async defer /> */}
      
      <AuthLayout>
        <ServerProvider>
          <RegisterForm />
        </ServerProvider>
      </AuthLayout>
    </>
  );
}
