export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  projectId: string;
  createdBy: string;
  estimatedTime?: string;
  actualTime?: string;
  attachments?: string[];
  comments?: Comment[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Comment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  members: ProjectMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'cancelled';

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  joinedAt: string;
}

export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';
