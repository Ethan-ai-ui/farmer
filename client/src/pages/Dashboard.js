import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const {
    data: { questionsHistory, savedTips, tasks, reminders },
    toggleTask,
    addReminder,
    removeReminder,
    removeTip,
    clearQuestions
  } = useUserData();
  const [reminderInput, setReminderInput] = useState('');

  const stats = useMemo(
    () => [
      { label: 'Questions asked', value: questionsHistory.length },
      { label: 'Saved tips', value: savedTips.length },
      { label: 'Open tasks', value: tasks.filter((task) => !task.completed).length }
    ],
    [questionsHistory.length, savedTips.length, tasks]
  );

  const recentQuestions = questionsHistory.slice(0, 5);
  const latestTips = savedTips.slice(0, 5);

  const handleAddReminder = (event) => {
    event.preventDefault();
    addReminder(reminderInput);
    setReminderInput('');
  };

  const resources = [
    { title: 'Seasonal planting guide', description: 'Best crops for the next 30 days.' },
    { title: 'Fertilizer calculator', description: 'Optimize nutrient mix for current soil.' },
    { title: 'Market price trends', description: 'Weekly overview of crop prices nearby.' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <span className="dashboard-user">Signed in as {currentUser?.name}</span>
          <button type="button" className="dashboard-primary" onClick={() => navigate('/')}>Go to landing page</button>
          <button type="button" className="dashboard-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Overview</h2>
            <span className="section-subtitle">Quick look at your activity</span>
          </div>
          <div className="dashboard-stats">
            {stats.map((item) => (
              <div key={item.label} className="dashboard-card">
                <span className="card-value">{item.value}</span>
                <span className="card-label">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section two-column">
          <div className="dashboard-panel">
            <div className="section-heading">
              <h2>Reminders</h2>
              <span className="section-subtitle">Keep your farm on track</span>
            </div>
            <form className="dashboard-reminder-form" onSubmit={handleAddReminder}>
              <input
                type="text"
                value={reminderInput}
                onChange={(event) => setReminderInput(event.target.value)}
                placeholder="Add a reminder"
              />
              <button type="submit" disabled={!reminderInput.trim()}>
                Add
              </button>
            </form>
            <ul className="dashboard-list">
              {reminders.length === 0 && <li className="dashboard-empty-item">No reminders yet.</li>}
              {reminders.map((item) => (
                <li key={item.id}>
                  <span>{item.message}</span>
                  <button type="button" onClick={() => removeReminder(item.id)} aria-label="Remove reminder">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-panel">
            <div className="section-heading">
              <h2>Helpful resources</h2>
              <span className="section-subtitle">Guides tailored for you</span>
            </div>
            <ul className="dashboard-resource-list">
              {resources.map((resource) => (
                <li key={resource.title}>
                  <span className="resource-title">{resource.title}</span>
                  <span className="resource-description">{resource.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dashboard-section two-column" id="tips">
          <div className="dashboard-panel">
            <div className="section-heading">
              <h2>Saved tips</h2>
              <span className="section-subtitle">Quick answers you saved from the assistant</span>
            </div>
            {latestTips.length === 0 ? (
              <p className="dashboard-empty">Save answers from the assistant to see them here.</p>
            ) : (
              <ul className="dashboard-tips">
                {latestTips.map((tip) => (
                  <li key={tip.id}>
                    <div className="tip-header">
                      <span className="tip-title">{tip.title}</span>
                      <button type="button" onClick={() => removeTip(tip.id)} aria-label="Remove saved tip">
                        Remove
                      </button>
                    </div>
                    <p className="tip-body">{tip.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-panel">
            <div className="section-heading">
              <h2>Tasks</h2>
              <span className="section-subtitle">Track what still needs attention</span>
            </div>
            {tasks.length === 0 ? (
              <p className="dashboard-empty">Add tasks to stay on top of farm work.</p>
            ) : (
              <ul className="dashboard-tasks">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <label className="task-item">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className={task.completed ? 'task-completed' : ''}>{task.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div className="section-heading-top">
              <h2>Recent questions</h2>
              {recentQuestions.length > 0 && (
                <button type="button" className="dashboard-button" onClick={clearQuestions}>
                  Clear history
                </button>
              )}
            </div>
            <span className="section-subtitle">Your latest conversations with the assistant</span>
          </div>
          {recentQuestions.length === 0 ? (
            <p className="dashboard-empty">Ask your first question to start building history.</p>
          ) : (
            <ul className="dashboard-questions">
              {recentQuestions.map((entry) => (
                <li key={entry.id}>
                  <div className="question-meta">
                    <span className="question-date">{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="question-prompt">{entry.prompt}</p>
                  <p className="question-answer">{entry.answer}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;


