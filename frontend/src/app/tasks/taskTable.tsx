'use client';

import { snakeCaseToTitleCase } from '@/src/utils/helper';
import { TASK_STATUS } from '@/src/utils/type';
import { useEffect, useState } from 'react';
import { Task } from './page';

interface Props {
  tasks: Task[];
  onSearch: (query: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (task: Task) => void;
  statusFilter: string;
  onStatusFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  pageSize: number;
  onPageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TaskTable({
  tasks = [],
  onSearch,
  onPageChange,
  onEdit,
  onDelete,
  onUpdateStatus,
  statusFilter,
  onStatusFilterChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [taskDetails, setTaskDetailsTo] = useState<Task[]>([]);
  const handlePageChange = (direction: 'NEXT' | 'PREV') => {
    const newPage = direction === 'NEXT' ? currentPage + 1 : currentPage - 1;
    if (newPage > 0) {
      setCurrentPage(newPage);
      onPageChange(newPage, pageSize);
    }
  };

  useEffect(() => {
    setTaskDetailsTo(tasks)
  }, [tasks])

  return (
    <div>
      <h2 className="text-lg font-bold">Task List</h2>
      <div className="mt-2 mb-2 flex justify-between">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium mb-2">Status Filter:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="border rounded p-2"
          >
            {Object.values(TASK_STATUS).map((status) => (
              <option key={status} value={status}>
                {snakeCaseToTitleCase(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table-auto w-full border">
        <thead>
          <tr>
            {/* <th className="border px-4 py-2"></th> */}
            <th className="border px-4 py-2">S.No</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
            {Array.isArray(taskDetails) && tasks.length > 0 ? (
                tasks.map((task, index) => (
                <tr key={task.id}>
                    {/* <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        onChange={() => onUpdateStatus(task)}
                      />                    
                    </td> */}
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{task.title}</td>
                    <td className="border px-4 py-2">{task.description}</td>
                    <td className="border px-4 py-2">{snakeCaseToTitleCase(task.status)}</td>
                    <td className="border px-4 py-2">
                        <button
                            onClick={() => onEdit(task)}
                            className="bg-blue-500 text-white p-1 rounded mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="bg-red-500 text-white p-1 rounded"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={5} className="border px-4 py-2 text-center">
                    No tasks found
                </td>
                </tr>
            )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">

        <div>
          <label htmlFor="pageSize" className="block text-sm font-medium mb-2">Page Size:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={onPageSizeChange}
            className="border rounded p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>
        
          <button
            onClick={() => handlePageChange('PREV')}
            className="bg-gray-500 text-white p-2 rounded ml-4"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange('NEXT')}
            className="bg-gray-500 text-white p-2 rounded ml-4"
          >
            Next
          </button>
  
      </div>
      </div>
    </div>
  );
}