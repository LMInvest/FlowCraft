import { useState, useEffect } from 'react';
import { Issue, Sprint, ViewType, IssueStatus, Priority, SprintStatus } from './types';
import { initialIssues, initialSprints } from './data';
import { generateTaskId, generateSprintId } from './utils';
import IssuesView from './components/IssuesView';
import SprintsView from './components/SprintsView';
import KanbanView from './components/KanbanView';
import Header from './components/Header';
import './App.css';

function App() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [currentView, setCurrentView] = useState<ViewType>('issues');
  const [darkMode, setDarkMode] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const createIssue = (
    title: string,
    description: string,
    priority: Priority,
    assignee: string
  ): void => {
    const newIssue: Issue = {
      id: generateTaskId(issues.map(i => i.id)),
      title,
      description,
      priority,
      status: 'Todo',
      assignee,
      sprintId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIssues([...issues, newIssue]);
  };

  const updateIssue = (id: string, updates: Partial<Issue>): void => {
    setIssues(
      issues.map(issue =>
        issue.id === id
          ? { ...issue, ...updates, updatedAt: new Date() }
          : issue
      )
    );
  };

  const deleteIssue = (id: string): void => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const assignIssueToSprint = (issueId: string, sprintId: string | null): void => {
    updateIssue(issueId, { sprintId });
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus): void => {
    updateIssue(issueId, { status });
  };

  const createSprint = (name: string, startDate: Date, endDate: Date): void => {
    const newSprint: Sprint = {
      id: generateSprintId(sprints.map(s => s.id)),
      name,
      status: 'Planned',
      startDate,
      endDate,
      createdAt: new Date(),
    };
    setSprints([...sprints, newSprint]);
  };

  const startSprint = (sprintId: string): void => {
    const hasActiveSprint = sprints.some(s => s.status === 'Active');
    if (hasActiveSprint) {
      alert('Only one sprint can be active at a time. Please end the current active sprint first.');
      return;
    }

    setSprints(
      sprints.map(sprint =>
        sprint.id === sprintId ? { ...sprint, status: 'Active' as SprintStatus } : sprint
      )
    );
  };

  const endSprint = (sprintId: string): void => {
    const unfinishedIssues = issues.filter(
      issue => issue.sprintId === sprintId && issue.status !== 'Done'
    );

    setIssues(
      issues.map(issue =>
        unfinishedIssues.some(ui => ui.id === issue.id)
          ? { ...issue, sprintId: null, updatedAt: new Date() }
          : issue
      )
    );

    setSprints(
      sprints.map(sprint =>
        sprint.id === sprintId ? { ...sprint, status: 'Completed' as SprintStatus } : sprint
      )
    );
  };

  const deleteSprint = (sprintId: string): void => {
    const sprintToDelete = sprints.find(s => s.id === sprintId);
    if (sprintToDelete?.status === 'Active') {
      alert('Cannot delete an active sprint. Please end it first.');
      return;
    }

    setIssues(
      issues.map(issue =>
        issue.sprintId === sprintId ? { ...issue, sprintId: null, updatedAt: new Date() } : issue
      )
    );

    setSprints(sprints.filter(sprint => sprint.id !== sprintId));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceSearchActive(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setVoiceSearchActive(false);
    };

    recognition.onend = () => {
      setVoiceSearchActive(false);
    };

    recognition.start();
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('show issues') || command.includes('issues view')) {
      setCurrentView('issues');
    } else if (command.includes('show sprint') || command.includes('current sprint')) {
      setCurrentView('current-sprint');
    } else if (command.includes('show sprints') || command.includes('sprints view')) {
      setCurrentView('sprints');
    } else if (command.includes('dark mode') || command.includes('toggle theme')) {
      toggleDarkMode();
    } else {
      alert(`Voice command not recognized: "${command}". Try saying "show issues", "show sprint", or "show sprints".`);
    }
  };

  const activeSprint = sprints.find(s => s.status === 'Active');

  return (
    <div className="app" role="application" aria-label="FlowCraft Task Management">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onVoiceSearch={startVoiceSearch}
        voiceSearchActive={voiceSearchActive}
      />

      <main className="main-content">
        {currentView === 'issues' && (
          <IssuesView
            issues={issues}
            sprints={sprints}
            onCreateIssue={createIssue}
            onUpdateIssue={updateIssue}
            onDeleteIssue={deleteIssue}
            onAssignToSprint={assignIssueToSprint}
          />
        )}

        {currentView === 'current-sprint' && (
          <KanbanView
            issues={issues}
            activeSprint={activeSprint}
            onUpdateIssueStatus={updateIssueStatus}
          />
        )}

        {currentView === 'sprints' && (
          <SprintsView
            sprints={sprints}
            issues={issues}
            onCreateSprint={createSprint}
            onStartSprint={startSprint}
            onEndSprint={endSprint}
            onDeleteSprint={deleteSprint}
          />
        )}
      </main>
    </div>
  );
}

export default App;
