import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Issue, Sprint, IssueStatus } from '../types';
import { getPriorityColor } from '../utils';
import { AlertCircle } from 'lucide-react';

interface KanbanViewProps {
  issues: Issue[];
  activeSprint: Sprint | undefined;
  onUpdateIssueStatus: (issueId: string, status: IssueStatus) => void;
}

const KanbanView = ({ issues, activeSprint, onUpdateIssueStatus }: KanbanViewProps) => {
  const columns: IssueStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];

  const sprintIssues = activeSprint
    ? issues.filter(issue => issue.sprintId === activeSprint.id)
    : [];

  const getIssuesByStatus = (status: IssueStatus) => {
    return sprintIssues.filter(issue => issue.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as IssueStatus;
    onUpdateIssueStatus(draggableId, newStatus);
  };

  if (!activeSprint) {
    return (
      <div className="kanban-view">
        <div className="empty-state" role="status">
          <AlertCircle size={48} aria-hidden="true" />
          <h3>No Active Sprint</h3>
          <p>Start a sprint from the Sprints view to see the kanban board.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-view">
      <div className="view-header">
        <div className="view-title-section">
          <h2>{activeSprint.name}</h2>
          <span className="issue-count" aria-label={`${sprintIssues.length} issues in sprint`}>
            {sprintIssues.length} issues
          </span>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board" role="region" aria-label="Kanban board">
          {columns.map(column => {
            const columnIssues = getIssuesByStatus(column);

            return (
              <div key={column} className="kanban-column">
                <div className="kanban-column-header">
                  <h3>{column}</h3>
                  <span className="column-count" aria-label={`${columnIssues.length} issues`}>
                    {columnIssues.length}
                  </span>
                </div>

                <Droppable droppableId={column}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column-content ${
                        snapshot.isDraggingOver ? 'dragging-over' : ''
                      }`}
                      role="list"
                      aria-label={`${column} column`}
                    >
                      {columnIssues.map((issue, index) => (
                        <Draggable key={issue.id} draggableId={issue.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              role="listitem"
                              aria-label={`Issue ${issue.id}: ${issue.title}`}
                            >
                              <div className="kanban-card-header">
                                <span className="kanban-card-id">{issue.id}</span>
                                <span
                                  className="priority-badge"
                                  style={{ backgroundColor: getPriorityColor(issue.priority) }}
                                  aria-label={`Priority ${issue.priority}`}
                                >
                                  {issue.priority}
                                </span>
                              </div>

                              <h4 className="kanban-card-title">{issue.title}</h4>

                              {issue.description && (
                                <p className="kanban-card-description">{issue.description}</p>
                              )}

                              <div className="kanban-card-footer">
                                <span className="kanban-card-assignee">{issue.assignee}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {columnIssues.length === 0 && (
                        <div className="kanban-empty-column" role="status">
                          <p>No issues</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanView;
