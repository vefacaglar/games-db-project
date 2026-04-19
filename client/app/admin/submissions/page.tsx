'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submissionApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import type { PlaytimeSubmission } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<PlaytimeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadSubmissions();
  }, [user]);

  const loadSubmissions = async () => {
    try {
      const res = await submissionApi.getPending();
      setSubmissions(res.data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await submissionApi.approve(id);
      loadSubmissions();
    } catch (error) {
      alert('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await submissionApi.reject(id);
      loadSubmissions();
    } catch (error) {
      alert('Failed to reject');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Submissions</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500">No pending submissions.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <Card key={sub._id}>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Game ID: {sub.gameId}</p>
                    <p className="text-sm text-gray-600">
                      Category: {sub.category} | Hours: {sub.hours}
                    </p>
                    {sub.platform && <p className="text-sm text-gray-500">Platform: {sub.platform}</p>}
                    {sub.notes && <p className="text-sm text-gray-500 mt-2">Notes: {sub.notes}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted: {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(sub._id)}>Approve</Button>
                    <Button onClick={() => handleReject(sub._id)} variant="danger">Reject</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}