import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { inventoryStore } from '../../stores/inventoryStore';
import Button from '../../components/common/Button';
import InventoryModal from '../../components/modals/InventoryModal';
import InventoryPartModal from '../../components/modals/InventoryPartModal';

const Inventory = observer(() => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [partModalOpen, setPartModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
  const [editPart, setEditPart] = useState<any | null>(null);

  useEffect(() => {
    inventoryStore.fetch();
  }, []);

  const handleCreate = async (data: any) => {
    await inventoryStore.create({ ...data, isActive: true });
  };

  const handleUpdate = async (data: any) => {
    if (!data.id) return;
    await inventoryStore.update(data.id, data);
  };

  const handleCreatePart = async (data: any) => {
    if (!selectedInventoryId) return;
    await inventoryStore.addPart(selectedInventoryId, data);
    await inventoryStore.fetch();
  };

  const handleUpdatePart = async (data: any) => {
    if (!editPart?.id) return;
    await inventoryStore.updatePart(editPart.id, data);
    await inventoryStore.fetch();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Инвентарь</h2>
        <Button onClick={() => setModalOpen(true)}>+ Добавить</Button>
      </div>

      <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Название</th>
              <th className="px-4 py-3 text-left">Тип</th>
              <th className="px-4 py-3 text-left">Описание</th>
              <th className="px-4 py-3 text-left">Кол-во</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventoryStore.items.map((item) => (
              <>
                <tr key={item.id} className="hover:bg-blue-50 transition duration-200 ease-in-out">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2">{item.type}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-800">{item.count || 0}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full font-semibold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {item.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-3">
                    <button
                      onClick={() => setEditItem(item)}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => inventoryStore.delete(item.id)}
                      className="text-red-500 hover:text-red-700 font-semibold transition"
                    >
                      Удалить
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInventoryId(item.id);
                        setEditPart(null);
                        setPartModalOpen(true);
                      }}
                      className="text-green-600 hover:text-green-800 font-semibold transition"
                    >
                      + Вложение
                    </button>
                  </td>

                </tr>
                {item.parts?.length > 0 && (
                  <tr>
                    <td colSpan={7} className="bg-blue-50 px-6 py-4">
                      <table className="w-full text-xs border border-gray-200 rounded">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="px-2 py-1 text-left">Название</th>
                            <th className="px-2 py-1 text-left">Серийный номер</th>
                            <th className="px-2 py-1 text-right">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.parts.map((sub: any, index: number) => (
                            <tr key={index} className="border-t border-gray-100">
                              <td className="px-2 py-1">{sub.name}</td>
                              <td className="px-2 py-1">{sub.serialNumber}</td>
                              <td className="px-2 py-1 text-right space-x-2">
                                <button
                                  className="text-blue-500 text-xs"
                                  onClick={() => {
                                    setEditPart(sub);
                                    setSelectedInventoryId(item.id);
                                    setPartModalOpen(true);
                                  }}
                                >
                                  Редактировать
                                </button>
                                <button
                                  className="text-red-500 text-xs"
                                  onClick={async () => {
                                    await inventoryStore.deletePart(sub.id);
                                    await inventoryStore.fetch();
                                  }}
                                >
                                  Удалить
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {inventoryStore.items.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Нет записей
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <InventoryModal onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
      )}

      {editItem && (
        <InventoryModal
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSubmit={handleUpdate}
        />
      )}

      {partModalOpen && (
        <InventoryPartModal
          initialData={editPart}
          onClose={() => {
            setEditPart(null);
            setPartModalOpen(false);
          }}
          onSubmit={(data) => {
            if (editPart) {
              handleUpdatePart(data);
            } else {
              handleCreatePart(data);
            }
          }}
        />
      )}
    </div>
  );
});

export default Inventory;
