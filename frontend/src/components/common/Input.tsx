// src/components/common/Input.tsx
import { motion } from 'framer-motion';
import { FC } from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  error?: string;
  required?: boolean;
}

const Input: FC<InputProps> = ({ label, value, onChange, type = 'text', error, required }) => {
  return (
    <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <label className="block text-sm font-semibold mb-1">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </motion.div>
  );
};

export default Input;
