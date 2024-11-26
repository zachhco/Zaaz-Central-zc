import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '../../types/kanban';
import { useKanban } from '../../hooks/useKanban';
import './KanbanBoard.css';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const {
    columns,
    loading,
    error,
    moveTask,
    addTask,
    updateTask,
    deleteTask
  } = useKanban(projectId);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    
    moveTask(
      draggableId,
      source.droppableId as TaskStatus,
      destination.droppableId as TaskStatus,
      destination.index
    );
  };

  if (loading) {
    return <div className="kanban-loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="kanban-error">{error}</div>;
  }

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-columns">
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <h3 className="column-title">{column.title}</h3>
              <Droppable droppableId={column.id}>
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="task-list"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-card"
                          >
                            <div className="task-header">
                              <h4>{task.title}</h4>
                              <div className="task-actions">
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="delete-button"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                              <span className={`priority priority-${task.priority}`}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="due-date">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="task-assignees">
                              {task.assignees.map(assignee => (
                                <span key={assignee} className="assignee">
                                  {assignee}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                className="add-task-button"
                onClick={() => {
                  const title = prompt('Enter task title:');
                  if (title) {
                    addTask({
                      title,
                      description: '',
                      status: column.id,
                      priority: 'medium',
                      assignees: [],
                      dueDate: '',
                      tags: []
                    });
                  }
                }}
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
