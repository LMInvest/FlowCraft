import { useState } from 'react';
import { Sprint, Issue } from '../types';
import { formatDate } from '../utils';
import { Plus, Play, StopCircle, Trash2, X, Check } from 'lucide-react';

interface SprintsViewProps {
  sprints: Sprint[];
  issues: Issue[];
  onCreateSprint: (name: string, startDate: Date, endDate: Date) => void;
  onStartSprint: (sprintId: string) => void;
  onEndSprint: (sprintId: string) => void;
  onDeleteSprint: (sprintId: string) => void;
}

const SprintsView = ({
  sprints,
  issues,
  onCreateSprint,
  onStartSprint,
  onEndSprint,
  onDeleteSprint,
}: SprintsViewProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      startDate: '',
      endDate: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Sprint name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Sprint name must be at least 3 characters';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }

    setFormErrors(errors);
    return !errors.name && !errors.startDate && !errors.endDate;
  };

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onCreateSprint(
      formData.name.trim(),
      new Date(formData.startDate),
      new Date(formData.endDate)
    );

    setFormData({
      name: '',
      startDate: '',
      endDate: '',
    });
    setFormErrors({ name: '', startDate: '', endDate: '' });
    setShowCreateModal(false);
  };

  const getSprintIssueCount = (sprintId: string) => {
    return issues.filter(issue => issue.sprintId === sprintId).length;
  };

  const getSprintCompletedCount = (sprintId: string) => {
    return issues.filter(issue => issue.sprintId === sprintId && issue.status === 'Done').length;
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteSprint(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const sortedSprints = [...sprints].sort((a, b) => {
    const statusOrder = { Active: 0, Planned: 1, Completed: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.startDate.getTime() - a.startDate.getTime();
  });

  return (
    <div className="sprints-view">
      <div className="view-header">
        <div className="view-title-section">
          <h2>Sprints</h2>
          <span className="issue-count" aria-label={`${sprints.length} sprints`}>
            {sprints.length}
          </span>
        </div>

        <button
          className="button-primary"
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new sprint"
        >
          <Plus size={18} aria-hidden="true" />
          <span>New Sprint</span>
        </button>
      </div>

      <div className="sprints-grid">
        {sortedSprints.map(sprint => {
          const issueCount = getSprintIssueCount(sprint.id);
          const completedCount = getSprintCompletedCount(sprint.id);

          return (
            <div key={sprint.id} className={`sprint-card sprint-${sprint.status.toLowerCase()}`}>
              <div className="sprint-card-header">
                <div>
                  <h3>{sprint.name}</h3>
                  <span className={`sprint-status-badge status-${sprint.status.toLowerCase()}`}>
                    {sprint.status}
                  </span>
                </div>

                <div className="sprint-card-actions">
                  {sprint.status === 'Planned' && (
                    <button
                      className="icon-button action"
                      onClick={() => onStartSprint(sprint.id)}
                      aria-label={`Start sprint ${sprint.name}`}
                      title="Start sprint"
                    >
                      <Play size={18} aria-hidden="true" />
                    </button>
                  )}

                  {sprint.status === 'Active' && (
                    <button
                      className="icon-button action"
                      onClick={() => onEndSprint(sprint.id)}
                      aria-label={`End sprint ${sprint.name}`}
                      title="End sprint"
                    >
                      <StopCircle size={18} aria-hidden="true" />
                    </button>
                  )}

                  {sprint.status !== 'Active' && (
                    <>
                      {deleteConfirmId === sprint.id ? (
                        <div className="delete-confirm">
                          <button
                            className="icon-button confirm"
                            onClick={confirmDelete}
                            aria-label="Confirm delete sprint"
                            title="Confirm delete"
                          >
                            <Check size={16} aria-hidden="true" />
                          </button>
                          <button
                            className="icon-button cancel"
                            onClick={() => setDeleteConfirmId(null)}
                            aria-label="Cancel delete"
                            title="Cancel"
                          >
                            <X size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="icon-button delete"
                          onClick={() => handleDeleteClick(sprint.id)}
                          aria-label={`Delete sprint ${sprint.name}`}
                          title="Delete sprint"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="sprint-card-body">
                <div className="sprint-dates">
                  <div className="date-item">
                    <span className="date-label">Start:</span>
                    <span className="date-value">{formatDate(sprint.startDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">End:</span>
                    <span className="date-value">{formatDate(sprint.endDate)}</span>
                  </div>
                </div>

                <div className="sprint-stats">
                  <div className="stat-item">
                    <span className="stat-label">Issues:</span>
                    <span className="stat-value">{issueCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Completed:</span>
                    <span className="stat-value">
                      {completedCount} / {issueCount}
                    </span>
                  </div>
                </div>

                {issueCount > 0 && (
                  <div className="progress-bar" role="progressbar" aria-valuenow={issueCount > 0 ? (completedCount / issueCount) * 100 : 0} aria-valuemin={0} aria-valuemax={100}>
                    <div
                      className="progress-fill"
                      style={{ width: `${issueCount > 0 ? (completedCount / issueCount) * 100 : 0}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sprints.length === 0 && (
        <div className="empty-state" role="status">
          <p>No sprints yet. Create your first sprint to get started!</p>
        </div>
      )}

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
          role="dialog"
          aria-labelledby="create-sprint-title"
          aria-modal="true"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="create-sprint-title">Create New Sprint</h3>
              <button
                className="icon-button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close dialog"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateSprint} className="modal-form">
              <div className="form-group">
                <label htmlFor="sprint-name">
                  Sprint Name <span className="required">*</span>
                </label>
                <input
                  id="sprint-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter sprint name"
                  aria-required="true"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? 'name-error' : undefined}
                />
                {formErrors.name && (
                  <span className="error-message" id="name-error" role="alert">
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sprint-start-date">
                    Start Date <span className="required">*</span>
                  </label>
                  <input
                    id="sprint-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    aria-required="true"
                    aria-invalid={!!formErrors.startDate}
                    aria-describedby={formErrors.startDate ? 'start-date-error' : undefined}
                  />
                  {formErrors.startDate && (
                    <span className="error-message" id="start-date-error" role="alert">
                      {formErrors.startDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="sprint-end-date">
                    End Date <span className="required">*</span>
                  </label>
                  <input
                    id="sprint-end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    aria-required="true"
                    aria-invalid={!!formErrors.endDate}
                    aria-describedby={formErrors.endDate ? 'end-date-error' : undefined}
                  />
                  {formErrors.endDate && (
                    <span className="error-message" id="end-date-error" role="alert">
                      {formErrors.endDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintsView;
