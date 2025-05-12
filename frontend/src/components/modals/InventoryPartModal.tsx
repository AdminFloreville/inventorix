import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { motion } from 'framer-motion';

export default function InventoryPartModal({
    initialData,
    onClose,
    onSubmit,
}: {
    initialData?: any;
    onClose: () => void;
    onSubmit: (data: any) => void;
}) {
    const [form, setForm] = useState({
        name: '',
        serialNumber: '',
        price: 0,
        isWrittenOff: false,
        ...initialData,
    });

    const handleChange = (key: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (!form.name || !form.serialNumber) return;
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
                    {form.id ? 'Редактировать часть' : 'Добавить часть'}
                </h2>

                <div className="space-y-3">
                    <Input
                        label="Серийный номер"
                        value={form.serialNumber}
                        onChange={(val) => handleChange('serialNumber', val)}
                    />
                    <Input
                        label="Наименование"
                        value={form.name}
                        onChange={(val) => handleChange('name', val)}
                    />
                    <Input
                        label="Цена"
                        value={form.price}
                        type="number"
                        onChange={(val) => handleChange('price', +val)}
                    />
                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            id="writtenOff"
                            type="checkbox"
                            checked={form.isWrittenOff}
                            onChange={(e) => handleChange('isWrittenOff', e.target.checked)}
                            className="w-4 h-4 border-gray-300"
                        />
                        <label htmlFor="writtenOff" className="text-sm text-gray-700">
                            Списан
                        </label>
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <Button onClick={onClose}>Отмена</Button>
                    <Button onClick={handleSave}>{form.id ? 'Сохранить' : 'Добавить'}</Button>
                </div>
            </motion.div>
        </div>
    );
}
