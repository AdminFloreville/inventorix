// src/components/common/Button.tsx
import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
}

const Button: FC<Props> = ({ children, onClick, type = 'button', disabled }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
