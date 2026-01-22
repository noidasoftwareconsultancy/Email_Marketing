'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DuplicateContacts } from '@/components/contacts/DuplicateContacts';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DuplicatesPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/contacts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Contacts
        </button>

        {/* Duplicate Management */}
        <DuplicateContacts />
      </div>
    </DashboardLayout>
  );
}
