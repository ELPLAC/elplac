import React from 'react';

interface InputProps {
  label: string;
  name: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  onChange,
  value,
  onBlur,
  error = false,  
  errorMessage = '',  
  placeholder
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
        className={`mt-1 block w-full py-2 px-3 border ${error ? 'border-red-600' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      />
      {error && errorMessage && (
        <div className="text-red-600 text-sm">{errorMessage}</div>
      )}
      
    </div>
  );
};

export default Input;

