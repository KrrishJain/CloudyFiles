import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to home page (layout will handle auth)
  redirect('/Home');
}
