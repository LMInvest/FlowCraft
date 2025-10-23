import { ViewType } from '../types';
import { Layout, CheckSquare, Target, Sun, Moon, Mic, MicOff } from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onVoiceSearch: () => void;
  voiceSearchActive: boolean;
}

const Header = ({
  currentView,
  onViewChange,
  darkMode,
  onToggleDarkMode,
  onVoiceSearch,
  voiceSearchActive,
}: HeaderProps) => {
  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Layout size={24} aria-hidden="true" />
            <h1>FlowCraft</h1>
          </div>

          <nav className="nav-tabs" role="navigation" aria-label="Main navigation">
            <button
              className={`nav-tab ${currentView === 'issues' ? 'active' : ''}`}
              onClick={() => onViewChange('issues')}
              aria-current={currentView === 'issues' ? 'page' : undefined}
              aria-label="Issues view"
            >
              <CheckSquare size={18} aria-hidden="true" />
              <span>Issues</span>
            </button>

            <button
              className={`nav-tab ${currentView === 'current-sprint' ? 'active' : ''}`}
              onClick={() => onViewChange('current-sprint')}
              aria-current={currentView === 'current-sprint' ? 'page' : undefined}
              aria-label="Current sprint kanban board"
            >
              <Layout size={18} aria-hidden="true" />
              <span>Current Sprint</span>
            </button>

            <button
              className={`nav-tab ${currentView === 'sprints' ? 'active' : ''}`}
              onClick={() => onViewChange('sprints')}
              aria-current={currentView === 'sprints' ? 'page' : undefined}
              aria-label="Sprints management"
            >
              <Target size={18} aria-hidden="true" />
              <span>Sprints</span>
            </button>
          </nav>
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={onVoiceSearch}
            aria-label={voiceSearchActive ? 'Voice search active' : 'Start voice search'}
            title="Voice Search (say: 'show issues', 'show sprint', or 'show sprints')"
          >
            {voiceSearchActive ? (
              <MicOff size={20} className="voice-active" aria-hidden="true" />
            ) : (
              <Mic size={20} aria-hidden="true" />
            )}
          </button>

          <button
            className="icon-button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
