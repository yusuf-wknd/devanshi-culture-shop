'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SortDropdown({
  options,
  value,
  onChange,
  className = '',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, optionValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(optionValue);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-w-[200px] flex items-center justify-between px-4 py-3 bg-background border-2 border-border rounded-xl text-foreground font-medium transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          isOpen ? 'border-primary/50 ring-2 ring-primary/20' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Sort options"
      >
        <span className="truncate">
          {selectedOption?.label || 'Select sort option'}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 hover:bg-secondary/50 focus:bg-secondary/50 focus:outline-none ${
                  isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'
                } ${
                  index > 0 ? 'border-t border-border/50' : ''
                }`}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
              >
                <span className="font-medium">
                  {option.label}
                </span>
                {isSelected && (
                  <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}