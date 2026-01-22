'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContactDetailView } from '@/components/contacts/ContactDetailView';
import { ContactForm } from '@/components/contacts/ContactForm';
import { Modal } from '@/components/ui/Modal';
import { Contact } from '@/lib/types';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchContact();
    }
  }, [params?.id]);

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setContact(data);
      } else {
        toast.error('Contact not found');
        router.push('/dashboard/contacts');
      }
    } catch (error) {
      toast.error('Failed to fetch contact');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: any) => {
    try {
      const response = await fetch(`/api/contacts/${params?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Contact updated successfully');
        setIsEditing(false);
        fetchContact();
      } else {
        toast.error('Failed to update contact');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${params?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Contact deleted successfully');
        router.push('/dashboard/contacts');
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contact...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!contact) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Contact not found</p>
        </div>
      </DashboardLayout>
    );
  }

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

        {/* Contact Detail View */}
        <ContactDetailView
          contact={contact}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={contact}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}
