'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Contact, ContactList } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validations';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PencilIcon,
  FunnelIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  TagIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Papa from 'papaparse';
import { ExcelImporter } from '@/components/contacts/ExcelImporter';
import { ContactForm } from '@/components/contacts/ContactForm';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedList, setSelectedList] = useState<string>('all');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchContacts();
    fetchContactLists();
    fetchStats();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, selectedStatus, selectedTag, selectedList]);

  useEffect(() => {
    // Extract all unique tags
    const tags = new Set<string>();
    contacts.forEach((contact) => {
      contact.tags.forEach((tag) => tags.add(tag));
    });
    setAllTags(Array.from(tags).sort());
  }, [contacts]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactLists = async () => {
    try {
      const response = await fetch('/api/contacts/lists');
      if (response.ok) {
        const data = await response.json();
        setContactLists(data);
      }
    } catch (error) {
      console.error('Failed to fetch contact lists');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contacts/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          contact.email.toLowerCase().includes(query) ||
          contact.name?.toLowerCase().includes(query) ||
          contact.company?.toLowerCase().includes(query) ||
          contact.firstName?.toLowerCase().includes(query) ||
          contact.lastName?.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((contact) => contact.status === selectedStatus);
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter((contact) => contact.tags.includes(selectedTag));
    }

    if (selectedList !== 'all') {
      if (selectedList === 'none') {
        filtered = filtered.filter((contact) => !contact.listId);
      } else {
        filtered = filtered.filter((contact) => contact.listId === selectedList);
      }
    }

    setFilteredContacts(filtered);
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts';
      const method = editingContact ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingContact ? 'Contact updated!' : 'Contact added!');
        setIsModalOpen(false);
        setEditingContact(null);
        fetchContacts();
        fetchStats();
      } else {
        toast.error('Failed to save contact');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Contact deleted');
        fetchContacts();
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const toggleSelectContact = (id: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedContacts.size === 0) {
      toast.error('No contacts selected');
      return;
    }

    try {
      const response = await fetch('/api/contacts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          contactIds: Array.from(selectedContacts),
          data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.affected} contacts ${action.replace('_', ' ')}`);
        setSelectedContacts(new Set());
        setIsBulkModalOpen(false);
        fetchContacts();
        fetchStats();
      } else {
        toast.error('Bulk action failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedTag !== 'all') params.append('tags', selectedTag);

      const response = await fetch(`/api/contacts/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Contacts exported successfully');
      } else {
        toast.error('Failed to export contacts');
      }
    } catch (error) {
      toast.error('An error occurred during export');
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const importedContacts = results.data.filter((row: any) => row.email);
        
        try {
          const response = await fetch('/api/contacts/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contacts: importedContacts }),
          });

          if (response.ok) {
            const data = await response.json();
            toast.success(`Imported ${data.count} contacts!`);
            setIsImportModalOpen(false);
            fetchContacts();
          } else {
            toast.error('Failed to import contacts');
          }
        } catch (error) {
          toast.error('An error occurred during import');
        }
      },
      error: () => {
        toast.error('Failed to parse CSV file');
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="mt-1 text-gray-600">
              Manage your email contacts and subscriber lists
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsStatsModalOpen(true)}
            >
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Analytics
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsExcelImportOpen(true)}
            >
              <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
              Import Excel
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsImportModalOpen(true)}
            >
              <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
              Import CSV
            </Button>
            <Button
              onClick={() => {
                setEditingContact(null);
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card padding="sm">
            <p className="text-sm text-gray-600">Total Contacts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
            {stats?.overview?.lastWeekGrowth > 0 && (
              <p className="text-xs text-green-600 mt-1">
                +{stats.overview.lastWeekGrowth} this week
              </p>
            )}
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {contacts.filter((c) => c.status === 'ACTIVE').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {contacts.length > 0 ? ((contacts.filter((c) => c.status === 'ACTIVE').length / contacts.length) * 100).toFixed(1) : 0}% of total
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Engagement</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {stats?.engagement?.engagementRate || '0'}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.engagement?.totalEngaged || 0} engaged
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Unsubscribed</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {contacts.filter((c) => c.status === 'UNSUBSCRIBED').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {contacts.length > 0 ? ((contacts.filter((c) => c.status === 'UNSUBSCRIBED').length / contacts.length) * 100).toFixed(1) : 0}% rate
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Bounced</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {contacts.filter((c) => c.status === 'BOUNCED').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {contacts.length > 0 ? ((contacts.filter((c) => c.status === 'BOUNCED').length / contacts.length) * 100).toFixed(1) : 0}% rate
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="UNSUBSCRIBED">Unsubscribed</option>
                  <option value="BOUNCED">Bounced</option>
                  <option value="COMPLAINED">Complained</option>
                </select>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Lists</option>
                  <option value="none">No List</option>
                  {contactLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list._count?.contacts || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedContacts.size > 0 && (
              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-900">
                  <strong>{selectedContacts.size}</strong> contact{selectedContacts.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsBulkModalOpen(true)}
                  >
                    <TagIcon className="w-4 h-4 mr-1" />
                    Bulk Actions
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedContacts(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Contacts Table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={filteredContacts.length > 0 && selectedContacts.size === filteredContacts.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company / Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading contacts...
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No contacts found. Add your first contact or import from CSV.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedContacts.has(contact.id)}
                          onChange={() => toggleSelectContact(contact.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {contact.name || contact.firstName || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          {contact.phone && (
                            <div className="text-xs text-gray-400 mt-1">{contact.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">
                            {contact.company || '-'}
                          </div>
                          {(contact.city || contact.state) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {[contact.city, contact.state].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.length > 0 ? (
                            contact.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">No tags</span>
                          )}
                          {contact.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{contact.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            contact.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : contact.status === 'UNSUBSCRIBED'
                              ? 'bg-orange-100 text-orange-700'
                              : contact.status === 'BOUNCED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(contact)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit contact"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete contact"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredContacts.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <strong>{filteredContacts.length}</strong> of <strong>{contacts.length}</strong> contacts
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={onSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingContact(null);
          }}
        />
      </Modal>

      {/* Import CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Contacts from CSV"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Upload a CSV file with the following columns: email, name, firstName, lastName,
            phone, company, tags
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Make sure your CSV has a header row with column names.
            </p>
          </div>
        </div>
      </Modal>

      {/* Excel Import Modal */}
      <ExcelImporter
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        onSuccess={() => {
          fetchContacts();
          fetchStats();
        }}
      />

      {/* Bulk Actions Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Actions"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Perform actions on <strong>{selectedContacts.size}</strong> selected contact{selectedContacts.size !== 1 ? 's' : ''}
          </p>
          <div className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                const tags = prompt('Enter tags to add (comma-separated):');
                if (tags) {
                  handleBulkAction('add_tags', { tags: tags.split(',').map(t => t.trim()) });
                }
              }}
            >
              <TagIcon className="w-5 h-5 mr-2" />
              Add Tags
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                const tags = prompt('Enter tags to remove (comma-separated):');
                if (tags) {
                  handleBulkAction('remove_tags', { tags: tags.split(',').map(t => t.trim()) });
                }
              }}
            >
              <TagIcon className="w-5 h-5 mr-2" />
              Remove Tags
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                if (contactLists.length === 0) {
                  toast.error('No contact lists available');
                  return;
                }
                const listId = prompt(`Enter list ID (${contactLists.map(l => `${l.name}: ${l.id}`).join(', ')}):`);
                if (listId) {
                  handleBulkAction('move_to_list', { listId });
                }
              }}
            >
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Move to List
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                const status = prompt('Enter status (ACTIVE, UNSUBSCRIBED, BOUNCED, COMPLAINED):');
                if (status && ['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED', 'COMPLAINED'].includes(status)) {
                  handleBulkAction('update_status', { status });
                } else if (status) {
                  toast.error('Invalid status');
                }
              }}
            >
              Update Status
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Delete ${selectedContacts.size} contacts? This cannot be undone.`)) {
                  handleBulkAction('delete');
                }
              }}
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        title="Contact Analytics"
        size="lg"
      >
        {stats ? (
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Active Rate</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.overview.total > 0 ? ((stats.overview.active / stats.overview.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-700">Engagement Rate</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.engagement.engagementRate}%</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Last Week Growth</p>
                  <p className="text-2xl font-bold text-blue-900">+{stats.overview.lastWeekGrowth}</p>
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Open Rate</p>
                  <p className="text-xl font-bold text-gray-900">{stats.engagement.openRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Click Rate</p>
                  <p className="text-xl font-bold text-gray-900">{stats.engagement.clickRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Engaged Contacts</p>
                  <p className="text-xl font-bold text-gray-900">{stats.engagement.totalEngaged}</p>
                </div>
              </div>
            </div>

            {/* Top Tags */}
            {stats.topTags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.topTags.map((item: any) => (
                    <span
                      key={item.tag}
                      className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                    >
                      {item.tag} ({item.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Sources */}
            {stats.topSources.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Sources</h3>
                <div className="space-y-2">
                  {stats.topSources.map((item: any) => (
                    <div key={item.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{item.source}</span>
                      <span className="text-sm text-gray-600">{item.count} contacts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Locations */}
            {stats.topLocations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Locations</h3>
                <div className="space-y-2">
                  {stats.topLocations.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{item.location}</span>
                      <span className="text-sm text-gray-600">{item.count} contacts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Loading analytics...</div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
