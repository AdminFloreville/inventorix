import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  initialData?: {
    id?: number;
    name: string;
    type: string;
    description: string;
  };
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const InventoryModal = ({ initialData, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.type) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {form.id ? 'Редактировать инвентарь' : 'Добавить инвентарь'}
        </h2>

        <div className="space-y-3">
          <Input label="Название" value={form.name} onChange={(val) => handleChange('name', val)} />
          <Input label="Тип" value={form.type} onChange={(val) => handleChange('type', val)} />
          <Input label="Описание" value={form.description} onChange={(val) => handleChange('description', val)} />
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit}>{form.id ? 'Сохранить' : 'Добавить'}</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryModal;
