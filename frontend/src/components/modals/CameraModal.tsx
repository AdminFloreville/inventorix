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
    name: string;
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

const CameraModal = ({ onClose, onSubmit, initialData }: Props) => {
  const [ipAddress, setIpAddress] = useState('');
  const [inventoryId, setInventoryId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialData) {
      setIpAddress(initialData.ipAddress);
      setInventoryId(initialData.inventoryId);
      setName(initialData.name ?? '');
      setDescription(initialData.description ?? '');
      setLocation(initialData.location ?? '');
    }
  }, [initialData]);

  useEffect(() => {
    inventoryStore.fetch();
  }, []);

  const validate = () => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;
    const newErrors: typeof errors = {};

    if (!ipAddress.trim()) newErrors.ipAddress = 'IP-адрес обязателен';
    else if (!ipRegex.test(ipAddress)) newErrors.ipAddress = 'Неверный формат IP';

    if (!name.trim()) newErrors.name = 'Название обязательно';
    if (!inventoryId) newErrors.inventoryId = 'Выберите элемент инвентаря';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      ipAddress,
      inventoryId: Number(inventoryId),
      name,
      description,
      location,
    });
    onClose();
  };

  const title = initialData ? 'Редактировать камеру' : 'Добавить камеру';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="space-y-4">
          <Input
            label="Название"
            value={name}
            onChange={(val) => {
              setName(val);
              if (touched.name) validate();
            }}
            error={touched.name ? errors.name : undefined}
          />

          <Input
            label="IP-адрес"
            value={ipAddress}
            onChange={(val) => {
              setIpAddress(val);
              if (touched.ipAddress) validate();
            }}
            error={touched.ipAddress ? errors.ipAddress : undefined}
          />

          <Input
            label="Описание"
            value={description}
            onChange={setDescription}
          />

          <Input
            label="Расположение"
            value={location}
            onChange={setLocation}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Инвентарь</label>
            <select
              value={inventoryId}
              onChange={(e) => {
                setInventoryId(Number(e.target.value));
                if (touched.inventoryId) validate();
              }}
              onBlur={() => handleBlur('inventoryId')}
              className={`w-full border rounded px-3 py-2 ${
                touched.inventoryId && errors.inventoryId ? 'border-red-500' : ''
              }`}
            >
              <option value="">Выберите...</option>
              {inventoryStore.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {touched.inventoryId && errors.inventoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.inventoryId}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit}>{initialData ? 'Сохранить' : 'Добавить'}</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CameraModal;
