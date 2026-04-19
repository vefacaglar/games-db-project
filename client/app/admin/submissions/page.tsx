'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submissionApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import type { PlaytimeSubmission } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<PlaytimeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

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
      setLoading(true);
      const res = await submissionApi.getPending();
      setSubmissions(res.data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingIds(prev => new Set(Array.from(prev).concat(id)));
    try {
      if (action === 'approve') {
        await submissionApi.approve(id);
      } else {
        await submissionApi.reject(id);
      }
      await loadSubmissions();
    } catch (error) {
      console.error(`Failed to ${action} submission:`, error);
      alert(`Failed to ${action} submission. Please try again.`);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (!user || user.role !== 'admin') return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pending Submissions</h1>
        <p className="text-gray-600 mt-1">Review and approve user-submitted playtimes</p>
      </div>

      {loading ? (
        <LoadingPage message="Loading submissions..." />
      ) : submissions.length === 0 ? (
        <EmptyState
          title="No pending submissions"
          description="All submissions have been reviewed. Check back later for new submissions."
        />
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <Card key={sub._id}>
              <CardContent padding="md">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Game ID: {sub.gameId}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {sub.category.replace('_', ' ')}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {sub.hours} hours
                          </span>
                          {sub.platform && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {sub.platform}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {sub.notes && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">{sub.notes}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Submitted: {formatDate(sub.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleAction(sub._id, 'approve')}
                      isLoading={processingIds.has(sub._id)}
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleAction(sub._id, 'reject')} 
                      variant="danger"
                      isLoading={processingIds.has(sub._id)}
                      size="sm"
                    >
                      Reject
                    </Button>
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