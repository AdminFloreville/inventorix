import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { cameraStore } from '../../stores/cameraStore';
import { inventoryStore } from '../../stores/inventoryStore';
import { useCameraSocket } from '../../hooks/useCameraSocket';
import CameraModal from '../../components/modals/CameraModal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Cameras = observer(() => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCamera, setEditCamera] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cameraStore.fetch(true);
    inventoryStore.fetch();
  }, []);

  useCameraSocket();

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || cameraStore.loading || !cameraStore.hasMore) return;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      cameraStore.fetch();
    }
  };

  const handleCreate = async (data: any) => {
    await cameraStore.create(data);
  };

  const handleUpdate = async (data: any) => {
    if (!editCamera) return;
    await cameraStore.update(editCamera.id, data);
    setEditCamera(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Камеры</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            label="Поиск по IP, названию, описанию..."
            value={cameraStore.searchTerm}
            onChange={(val) => cameraStore.setSearchTerm(val)}
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
            
            {(cameraStore.items).map((cam) => (
              <tr key={cam.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2">{cam.id}</td>
                <td className="px-4 py-2 font-mono">{cam.ipAddress}</td>
                <td className="px-4 py-2 font-medium">{cam.name}</td>
                <td className="px-4 py-2">{cam.description}</td>
                <td className="px-4 py-2">{cam.location}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-medium ${
                      cam.isOnline ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        cam.isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    {cam.isOnline
                      ? 'Онлайн'
                      : cam.offlineSince
                      ? `Оффлайн с ${new Date(cam.offlineSince).toLocaleTimeString()}`
                      : 'Оффлайн'}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() => setEditCamera(cam)}
                    className="text-blue-500 hover:underline"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить камеру?')) cameraStore.delete(cam.id);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {cameraStore?.items?.length === 0 && !cameraStore.loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  Камеры не найдены
                </td>
              </tr>
            )}
            {cameraStore.loading && (
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
        <CameraModal onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
      )}

      {editCamera && (
        <CameraModal
          initialData={{
            ipAddress: editCamera.ipAddress,
            inventoryId: editCamera.inventory.id,
            name: editCamera.name,
            description: editCamera.description,
            location: editCamera.location,
          }}
          onClose={() => setEditCamera(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
});

export default Cameras;
