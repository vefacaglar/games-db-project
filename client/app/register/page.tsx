'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}