// src/components/modals/PrinterModal.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import { inventoryStore } from '../../stores/inventoryStore';

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    ipAddress: string;
    inventoryId: number;
    name?: string;
    description?: string;
    location?: string;
  }) => void;
  initialData?: {
    ipAddress: string;
    inventoryId: number;
    name?: string;
    description?: string;
    location?: string;
  };
}

const PrinterModal = ({ onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState({
    ipAddress: '',
    inventoryId: '',
    name: '',
    description: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ipAddress: initialData.ipAddress,
        inventoryId: String(initialData.inventoryId),
        name: initialData.name || '',
        description: initialData.description || '',
        location: initialData.location || '',
      });
    }
    inventoryStore.fetch();
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.ipAddress.trim()) newErrors.ipAddress = 'IP-адрес обязателен';
    if (!form.inventoryId) newErrors.inventoryId = 'Выберите инвентарь';
    return newErrors;
  };

  const handleSubmit = () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      onSubmit({
        ipAddress: form.ipAddress,
        inventoryId: Number(form.inventoryId),
        name: form.name,
        description: form.description,
        location: form.location,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Редактировать принтер' : 'Добавить принтер'}
        </h2>

        <div className="space-y-4">
          <Input
            label="IP-адрес"
            value={form.ipAddress}
            onChange={(val) => setForm((p) => ({ ...p, ipAddress: val }))}
            error={errors.ipAddress}
          />
          <Input
            label="Название"
            value={form.name}
            onChange={(val) => setForm((p) => ({ ...p, name: val }))}
          />
          <Input
            label="Описание"
            value={form.description}
            onChange={(val) => setForm((p) => ({ ...p, description: val }))}
          />
          <Input
            label="Расположение"
            value={form.location}
            onChange={(val) => setForm((p) => ({ ...p, location: val }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Инвентарь</label>
            <select
              className={`w-full border rounded px-3 py-2 ${errors.inventoryId ? 'border-red-500' : ''}`}
              value={form.inventoryId}
              onChange={(e) => setForm((p) => ({ ...p, inventoryId: e.target.value }))}
            >
              <option value="">Выберите...</option>
              {inventoryStore.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.inventoryId && <p className="text-red-500 text-sm mt-1">{errors.inventoryId}</p>}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Сохранить' : 'Добавить'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrinterModal;
