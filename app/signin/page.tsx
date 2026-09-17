import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import SigninForm from './SigninForm';

export const dynamic = 'force-dynamic';

export default async function SigninPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  }

  return <SigninForm />;
}
