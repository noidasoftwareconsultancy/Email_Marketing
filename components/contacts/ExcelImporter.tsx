'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import {
  ArrowUpTrayIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface ExcelImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExcelImporter({ isOpen, onClose, onSuccess }: ExcelImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      
      if (!validTypes.includes(selectedFile.type) && 
          !selectedFile.name.endsWith('.xlsx') && 
          !selectedFile.name.endsWith('.xls')) {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
        return;
      }

      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/contacts/import-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        toast.success(data.message);
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to import Excel file');
      }
    } catch (error) {
      toast.error('An error occurred during import');
      console.error('Import error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import from Excel (Domain Data)"
      size="lg"
    >
      <div className="space-y-6">
        {/* File Upload */}
        {!results && (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <DocumentArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {file && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                    Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Domain Data Import</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Supports Excel files (.xlsx, .xls) with domain registration data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Automatically converts domain data to contact format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Generates emails if not provided (info@domain, contact@domain, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Extracts company, location, and contact information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Adds domain details to contact notes</span>
                </li>
              </ul>
            </div>

            {/* Expected Columns */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Expected Columns</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Required:</p>
                  <ul className="space-y-0.5">
                    <li>• domain_name</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Optional:</p>
                  <ul className="space-y-0.5">
                    <li>• registrant_name</li>
                    <li>• registrant_company</li>
                    <li>• registrant_email</li>
                    <li>• registrant_phone</li>
                    <li>• registrant_state</li>
                    <li>• registrant_country</li>
                    <li>• and more...</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={!file}
              >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Import Excel File
              </Button>
            </div>
          </>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">Imported</p>
                <p className="text-3xl font-bold text-green-900">{results.imported}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">Updated</p>
                <p className="text-3xl font-bold text-blue-900">{results.updated}</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">Skipped</p>
                <p className="text-3xl font-bold text-orange-900">{results.skipped}</p>
              </div>
            </div>

            {/* Statistics */}
            {results.stats && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Import Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Domains:</p>
                    <p className="font-semibold text-gray-900">{results.stats.totalDomains}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Contacts:</p>
                    <p className="font-semibold text-gray-900">{results.stats.totalContacts}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">With Company:</p>
                    <p className="font-semibold text-gray-900">{results.stats.withCompany}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">With Phone:</p>
                    <p className="font-semibold text-gray-900">{results.stats.withPhone}</p>
                  </div>
                </div>

                {/* By State */}
                {Object.keys(results.stats.byState).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">By State:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(results.stats.byState).slice(0, 10).map(([state, count]: [string, any]) => (
                        <span
                          key={state}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          {state}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Errors */}
            {results.errors && results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Errors ({results.errors.length})
                </h4>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="space-y-1 text-sm text-red-800">
                    {results.errors.slice(0, 10).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {results.errors.length > 10 && (
                      <li className="font-semibold">... and {results.errors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end">
              <Button onClick={handleClose}>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
