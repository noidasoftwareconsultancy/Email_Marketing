'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Tag {
  tag: string;
  count: number;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  helperText?: string;
}

export function TagSelector({
  selectedTags,
  onChange,
  label = 'Target Tags',
  helperText = 'Select tags to target specific contacts',
}: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [contactCount, setContactCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [selectedTags]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTags.length > 0) {
        params.set('tags', selectedTags.join(','));
      }
      
      const response = await fetch(`/api/contacts/tags?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data.tags);
        setContactCount(data.contactCount);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowDropdown(false);
  };

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowDropdown(value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const filteredTags = availableTags.filter(
    (t) =>
      !selectedTags.includes(t.tag) &&
      t.tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => {
              const tagData = availableTags.find((t) => t.tag === tag);
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {tag}
                  {tagData && (
                    <span className="text-xs text-indigo-600">({tagData.count})</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Input with Dropdown */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(inputValue.length > 0)}
            placeholder="Type to search or add tags..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Dropdown */}
          {showDropdown && filteredTags.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredTags.map((tag) => (
                <button
                  key={tag.tag}
                  type="button"
                  onClick={() => handleAddTag(tag.tag)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="text-gray-900">{tag.tag}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {tag.count} contacts
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>

      {/* Contact Count Display */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target Audience</p>
              <p className="text-2xl font-bold text-indigo-900">
                {loading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  <>
                    {contactCount.toLocaleString()}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      {contactCount === 1 ? 'contact' : 'contacts'}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          {selectedTags.length === 0 && (
            <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              All active contacts
            </div>
          )}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-indigo-200">
            <p className="text-xs text-gray-600">
              Contacts with {selectedTags.length === 1 ? 'tag' : 'any of these tags'}:{' '}
              <span className="font-semibold text-indigo-700">
                {selectedTags.join(', ')}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Available Tags Preview */}
      {!loading && availableTags.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Available Tags ({availableTags.length})
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {availableTags.slice(0, 20).map((tag) => (
              <button
                key={tag.tag}
                type="button"
                onClick={() => handleAddTag(tag.tag)}
                disabled={selectedTags.includes(tag.tag)}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  selectedTags.includes(tag.tag)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-300'
                }`}
              >
                {tag.tag} ({tag.count})
              </button>
            ))}
            {availableTags.length > 20 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{availableTags.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
