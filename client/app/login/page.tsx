'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}