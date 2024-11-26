import { useState, useEffect, useCallback } from 'react';
import { Task, KanbanColumn, TaskStatus } from '../types/kanban';
import { tasksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const COLUMN_ORDER: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

const COLUMN_TITLES: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
};

export const useKanban = (projectId: string) => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const initializeColumns = (tasks: Task[]) => {
    const newColumns = COLUMN_ORDER.map(status => ({
      id: status,
      title: COLUMN_TITLES[status],
      tasks: tasks.filter(task => task.status === status)
    }));
    setColumns(newColumns);
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await tasksAPI.getAll(projectId);
      initializeColumns(tasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const moveTask = async (
    taskId: string,
    sourceColId: TaskStatus,
    destinationColId: TaskStatus,
    newIndex: number
  ) => {
    // Optimistically update the UI
    const newColumns = [...columns];
    const sourceCol = newColumns.find(col => col.id === sourceColId);
    const destCol = newColumns.find(col => col.id === destinationColId);
    
    if (!sourceCol || !destCol) return;

    const taskToMove = sourceCol.tasks.find(task => task.id === taskId);
    if (!taskToMove) return;

    // Remove from source column
    sourceCol.tasks = sourceCol.tasks.filter(task => task.id !== taskId);

    // Add to destination column
    const updatedTask = { ...taskToMove, status: destinationColId };
    destCol.tasks.splice(newIndex, 0, updatedTask);

    setColumns(newColumns);

    // Update in backend
    try {
      await tasksAPI.updateStatus(projectId, taskId, destinationColId);
    } catch (err) {
      // Revert changes on error
      setError('Failed to update task status');
      fetchTasks();
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await tasksAPI.create(projectId, {
        ...taskData,
        status: 'todo',
        createdBy: user?.id
      });
      
      const newColumns = [...columns];
      const todoColumn = newColumns.find(col => col.id === 'todo');
      if (todoColumn) {
        todoColumn.tasks.push(newTask);
        setColumns(newColumns);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await tasksAPI.update(projectId, taskId, taskData);
      
      const newColumns = columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      }));
      
      setColumns(newColumns);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await tasksAPI.delete(projectId, taskId);
      
      const newColumns = columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }));
      
      setColumns(newColumns);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    columns,
    loading,
    error,
    moveTask,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks
  };
};
