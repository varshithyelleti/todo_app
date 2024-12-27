'use client';

import { useContext, useEffect, useState } from 'react';
import CreateForm from './createTask';
import {  QueryParams, useTaskService } from '@/src/services/useTaskService';
import { HTTP_STATUS, TASK_STATUS } from '@/src/utils/type';
import TaskTable from './taskTable';
import { AuthenticatedUserContext } from '@/src/contexts/AuthenticatedUserContext';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TASK_STATUS;
  startDateTime: Date;
  endDateTime: Date;
}

export default function TasksPage() {
  const { user } = useContext(AuthenticatedUserContext);
  const router = useRouter();
  const { getAllTasks, deleteTask, updateTask } = useTaskService();
  const [mode, setMode] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [details, setDetails] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TASK_STATUS>(TASK_STATUS.TODO);

  const fetchTasks = async (searchQuery = query, page = currentPage, size = pageSize) => {
    try {
      const params: QueryParams = {
        status: statusFilter,
        page,
        size,
      };
      const response = await getAllTasks(params);
      if (response.status === HTTP_STATUS.OK) {
        setTasks(response.data.data);
      } else {
        console.error('Failed to fetch tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
      fetchTasks();
  }, [ currentPage, pageSize, statusFilter]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    fetchTasks(searchQuery, 1, pageSize);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleUpsert = (newTask: Task | null) => {
    if (newTask) {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }
    fetchTasks();
    if (!mode) {
      setMode(true);
      setDetails(null);
    }
  };

  const handleEdit = (task: Task) => {
    setMode(false);
    setDetails(task);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteTask(id);
      if (response.status === HTTP_STATUS.OK) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        await fetchTasks();
      } else {
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateStatus = async (task: Task) => {
    const updatedTask = {
      ...task,
      status: task.status === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE,
    };
    if (!task?.id) return;
    try {
      const response = await updateTask(task.id, updatedTask);
      if (response.status === HTTP_STATUS.OK) {
        await fetchTasks();
      } else {
        console.error('Failed to update task status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as TASK_STATUS);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <div className="container mx-auto p-4">
      <CreateForm 
        onCreate={handleUpsert} 
        mode={mode} 
        details={details} 
      />
      <TaskTable 
          tasks={tasks} 
          onSearch={handleSearch} 
          onPageChange={handlePageChange} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
    </div>
  );
}