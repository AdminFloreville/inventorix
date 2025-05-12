import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { historyStore } from '../../stores/historyStore';

const History = observer(() => {
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  useEffect(() => {
    historyStore.fetch();
  }, []);

  const filtered = historyStore.filterByAction(actionFilter);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">История изменений</h2>

      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: 'Все', value: null },
          { label: 'Создание', value: 'create' },
          { label: 'Обновление', value: 'update' },
          { label: 'Удаление', value: 'delete' },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setActionFilter(value)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
              actionFilter === value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Сущность</th>
              <th className="px-4 py-3 text-left">ID элемента</th>
              <th className="px-4 py-3 text-left">Действие</th>
              <th className="px-4 py-3 text-left">Время</th>
              <th className="px-4 py-3 text-left">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.entity}</td>
                <td className="px-4 py-2">{item.entityId}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      item.action === 'create'
                        ? 'bg-green-100 text-green-700'
                        : item.action === 'update'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.action}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-600 text-xs max-w-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">
                    <code>{JSON.stringify(item.payload, null, 2)}</code>
                  </pre>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Записей нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default History;
