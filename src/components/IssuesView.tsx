import { useState, useMemo } from 'react';
import { Issue, Sprint, Priority, IssueStatus } from '../types';
import { getPriorityColor } from '../utils';
import { Plus, Trash2, X, Check, Search } from 'lucide-react';

interface IssuesViewProps {
  issues: Issue[];
  sprints: Sprint[];
  onCreateIssue: (title: string, description: string, priority: Priority, assignee: string) => void;
  onUpdateIssue: (id: string, updates: Partial<Issue>) => void;
  onDeleteIssue: (id: string) => void;
  onAssignToSprint: (issueId: string, sprintId: string | null) => void;
}

type SortField = 'id' | 'title' | 'priority' | 'status' | 'assignee' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const IssuesView = ({
  issues,
  sprints,
  onCreateIssue,
  onUpdateIssue,
  onDeleteIssue,
  onAssignToSprint,
}: IssuesViewProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  const [filterSprint, setFilterSprint] = useState<string | 'all' | 'backlog'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'P2' as Priority,
    assignee: '',
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    assignee: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      title: '',
      assignee: '',
    };

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.assignee.trim()) {
      errors.assignee = 'Assignee is required';
    }

    setFormErrors(errors);
    return !errors.title && !errors.assignee;
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onCreateIssue(
      formData.title.trim(),
      formData.description.trim(),
      formData.priority,
      formData.assignee.trim()
    );

    setFormData({
      title: '',
      description: '',
      priority: 'P2',
      assignee: '',
    });
    setFormErrors({ title: '', assignee: '' });
    setShowCreateModal(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = [...issues];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        issue =>
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query) ||
          issue.id.toLowerCase().includes(query) ||
          issue.assignee.toLowerCase().includes(query)
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(issue => issue.priority === filterPriority);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(issue => issue.status === filterStatus);
    }

    if (filterSprint === 'backlog') {
      filtered = filtered.filter(issue => issue.sprintId === null);
    } else if (filterSprint !== 'all') {
      filtered = filtered.filter(issue => issue.sprintId === filterSprint);
    }

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'priority') {
        aVal = parseInt(a.priority.replace('P', ''));
        bVal = parseInt(b.priority.replace('P', ''));
      }

      if (aVal instanceof Date) {
        aVal = aVal.getTime();
        bVal = bVal.getTime();
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [issues, sortField, sortDirection, filterPriority, filterStatus, filterSprint, searchQuery]);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteIssue(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const priorities: Priority[] = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5'];
  const statuses: IssueStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];

  return (
    <div className="issues-view">
      <div className="view-header">
        <div className="view-title-section">
          <h2>Issues</h2>
          <span className="issue-count" aria-label={`${filteredAndSortedIssues.length} issues`}>
            {filteredAndSortedIssues.length}
          </span>
        </div>

        <button
          className="button-primary"
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new issue"
        >
          <Plus size={18} aria-hidden="true" />
          <span>New Issue</span>
        </button>
      </div>

      <div className="filters-section" role="search" aria-label="Filter issues">
        <div className="search-box">
          <Search size={18} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search issues by title, description, ID, or assignee"
          />
        </div>

        <div className="filters">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filterSprint}
            onChange={(e) => setFilterSprint(e.target.value)}
            aria-label="Filter by sprint"
          >
            <option value="all">All Sprints</option>
            <option value="backlog">Backlog</option>
            {sprints.map(sprint => (
              <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="issues-table-container">
        <table className="issues-table" role="table">
          <thead>
            <tr>
              <th>
                <button
                  className="sort-button"
                  onClick={() => handleSort('id')}
                  aria-label="Sort by ID"
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button
                  className="sort-button"
                  onClick={() => handleSort('title')}
                  aria-label="Sort by title"
                >
                  Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button
                  className="sort-button"
                  onClick={() => handleSort('priority')}
                  aria-label="Sort by priority"
                >
                  Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button
                  className="sort-button"
                  onClick={() => handleSort('status')}
                  aria-label="Sort by status"
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button
                  className="sort-button"
                  onClick={() => handleSort('assignee')}
                  aria-label="Sort by assignee"
                >
                  Assignee {sortField === 'assignee' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>Sprint</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedIssues.map(issue => (
              <tr key={issue.id}>
                <td className="issue-id">{issue.id}</td>
                <td className="issue-title">
                  {editingId === issue.id ? (
                    <input
                      type="text"
                      value={issue.title}
                      onChange={(e) => onUpdateIssue(issue.id, { title: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingId(null);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      aria-label="Edit issue title"
                    />
                  ) : (
                    <span onClick={() => setEditingId(issue.id)} style={{ cursor: 'pointer' }}>
                      {issue.title}
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(issue.priority) }}
                    aria-label={`Priority ${issue.priority}`}
                  >
                    {issue.priority}
                  </span>
                </td>
                <td>
                  <select
                    value={issue.status}
                    onChange={(e) => onUpdateIssue(issue.id, { status: e.target.value as IssueStatus })}
                    className="status-select"
                    aria-label={`Change status for ${issue.id}`}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>{issue.assignee}</td>
                <td>
                  <select
                    value={issue.sprintId || 'backlog'}
                    onChange={(e) => {
                      const value = e.target.value === 'backlog' ? null : e.target.value;
                      onAssignToSprint(issue.id, value);
                    }}
                    className="sprint-select"
                    aria-label={`Assign ${issue.id} to sprint`}
                  >
                    <option value="backlog">Backlog</option>
                    {sprints
                      .filter(s => s.status === 'Planned' || s.status === 'Active')
                      .map(sprint => (
                        <option key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="actions-cell">
                  {deleteConfirmId === issue.id ? (
                    <div className="delete-confirm">
                      <button
                        className="icon-button confirm"
                        onClick={confirmDelete}
                        aria-label="Confirm delete"
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
                      onClick={() => handleDeleteClick(issue.id)}
                      aria-label={`Delete issue ${issue.id}`}
                      title="Delete issue"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedIssues.length === 0 && (
          <div className="empty-state" role="status">
            <p>No issues found</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
          role="dialog"
          aria-labelledby="create-issue-title"
          aria-modal="true"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="create-issue-title">Create New Issue</h3>
              <button
                className="icon-button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close dialog"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="modal-form">
              <div className="form-group">
                <label htmlFor="issue-title">
                  Title <span className="required">*</span>
                </label>
                <input
                  id="issue-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter issue title"
                  aria-required="true"
                  aria-invalid={!!formErrors.title}
                  aria-describedby={formErrors.title ? 'title-error' : undefined}
                />
                {formErrors.title && (
                  <span className="error-message" id="title-error" role="alert">
                    {formErrors.title}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="issue-description">Description</label>
                <textarea
                  id="issue-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter issue description"
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="issue-priority">Priority</label>
                  <select
                    id="issue-priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="issue-assignee">
                    Assignee <span className="required">*</span>
                  </label>
                  <input
                    id="issue-assignee"
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    placeholder="Enter assignee name"
                    aria-required="true"
                    aria-invalid={!!formErrors.assignee}
                    aria-describedby={formErrors.assignee ? 'assignee-error' : undefined}
                  />
                  {formErrors.assignee && (
                    <span className="error-message" id="assignee-error" role="alert">
                      {formErrors.assignee}
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
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesView;
