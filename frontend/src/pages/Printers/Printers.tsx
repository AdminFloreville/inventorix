import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { printerStore } from '../../stores/printerStore';
import { inventoryStore } from '../../stores/inventoryStore';
import { usePrinterSocket } from '../../hooks/usePrinterSocket';
import PrinterModal from '../../components/modals/PrinterModal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Printers = observer(() => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editPrinter, setEditPrinter] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    printerStore.fetch(true);
    inventoryStore.fetch();
  }, []);

  usePrinterSocket();

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || printerStore.loading || !printerStore.hasMore) return;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      printerStore.fetch();
    }
  };

  const handleCreate = async (data: any) => {
    await printerStore.create(data);
  };

  const handleUpdate = async (data: any) => {
    if (!editPrinter) return;
    await printerStore.update(editPrinter.id, data);
    setEditPrinter(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Принтеры</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            label="Поиск по IP, названию, описанию..."
            value={printerStore.searchTerm}
            onChange={(val) => printerStore.setSearchTerm(val)}
          />
          <Button onClick={() => setModalOpen(true)}>+ Добавить</Button>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="border border-gray-200 rounded-xl overflow-auto max-h-[600px]"
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">IP</th>
              <th className="px-4 py-3 text-left">Название</th>
              <th className="px-4 py-3 text-left">Описание</th>
              <th className="px-4 py-3 text-left">Расположение</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {printerStore.items.map((printer) => (
              <tr key={printer.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2">{printer.id}</td>
                <td className="px-4 py-2 font-mono">{printer.ipAddress}</td>
                <td className="px-4 py-2 font-medium">{printer.name}</td>
                <td className="px-4 py-2">{printer.description}</td>
                <td className="px-4 py-2">{printer.location}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-medium ${
                      printer.isOnline ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        printer.isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    {printer.isOnline
                      ? 'Онлайн'
                      : printer.offlineSince
                      ? `Оффлайн с ${new Date(printer.offlineSince).toLocaleTimeString()}`
                      : 'Оффлайн'}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() => setEditPrinter(printer)}
                    className="text-blue-500 hover:underline"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить принтер?')) printerStore.delete(printer.id);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {printerStore.items.length === 0 && !printerStore.loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  Принтеры не найдены
                </td>
              </tr>
            )}
            {printerStore.loading && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Загрузка...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <PrinterModal onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
      )}

      {editPrinter && (
        <PrinterModal
          initialData={{
            ipAddress: editPrinter.ipAddress,
            inventoryId: editPrinter.inventory.id,
            name: editPrinter.name,
            description: editPrinter.description,
            location: editPrinter.location,
          }}
          onClose={() => setEditPrinter(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
});

export default Printers;
