import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  HelpCircle,
  TrendingUp,
  FileText,
  User,
  Shield,
  Users,
  Layers,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export function Sidebar({ collapsed, toggleCollapse, mobileOpen, closeMobile }) {
  const { user, isAdmin } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={22} />
        </div>
        {!collapsed && (
          <div className="brand-title">
            Pocket<span style={{ color: 'var(--primary)' }}>Skill</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'Dashboard' : ''}
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/courses"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'Courses' : ''}
        >
          <BookOpen size={20} />
          {!collapsed && <span>Courses</span>}
        </NavLink>

        <NavLink
          to="/quizzes"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'Quizzes' : ''}
        >
          <HelpCircle size={20} />
          {!collapsed && <span>Quizzes</span>}
        </NavLink>

        <NavLink
          to="/predictions"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'Score Predictions' : ''}
        >
          <TrendingUp size={20} />
          {!collapsed && <span>Predictions</span>}
        </NavLink>

        <NavLink
          to="/pdf-summarizer"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'PDF Summarizer' : ''}
        >
          <FileText size={20} />
          {!collapsed && <span>PDF Summarizer</span>}
        </NavLink>

        <NavLink
          to="/achievements"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'Achievements' : ''}
        >
          <Award size={20} />
          {!collapsed && <span>Achievements</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobile}
          title={collapsed ? 'Profile' : ''}
        >
          <User size={20} />
          {!collapsed && <span>Profile</span>}
        </NavLink>

        {isAdmin && (
          <>
            {!collapsed && <div className="nav-section-label">Administration</div>}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
              title={collapsed ? 'Admin Overview' : ''}
            >
              <Shield size={20} />
              {!collapsed && <span>Admin Overview</span>}
            </NavLink>

            <NavLink
              to="/admin/students"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
              title={collapsed ? 'Student Directory' : ''}
            >
              <Users size={20} />
              {!collapsed && <span>Students</span>}
            </NavLink>

            <NavLink
              to="/admin/courses"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
              title={collapsed ? 'Course CRUD' : ''}
            >
              <Layers size={20} />
              {!collapsed && <span>Course Manager</span>}
            </NavLink>

            <NavLink
              to="/admin/quizzes"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
              title={collapsed ? 'Question Bank' : ''}
            >
              <Database size={20} />
              {!collapsed && <span>Question Bank</span>}
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
              title={collapsed ? 'Audit Logs' : ''}
            >
              <Activity size={20} />
              {!collapsed && <span>Audit Logs</span>}
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <button
          className="btn-icon"
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ width: '100%', display: 'flex', gap: '0.5rem' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> <span style={{ fontSize: '0.85rem' }}>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
