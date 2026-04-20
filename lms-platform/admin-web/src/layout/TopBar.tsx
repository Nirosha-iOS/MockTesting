import { Button, IconButton, SearchField } from "../components/ui";
import { useThemeMode } from "../theme/ThemeProvider";
import { useAuth } from "../features/auth/AuthContext";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type TopBarProps = {
  isMobileNavOpen?: boolean;
  onMobileNavToggle?: () => void;
};

export function TopBar({ isMobileNavOpen = false, onMobileNavToggle }: TopBarProps) {
  const { user, logout } = useAuth();
  const { mode, setMode } = useThemeMode();
  const display = user?.displayName ?? "User";

  return (
    <header className="crm-topbar">
      <IconButton
        variant="menu"
        onClick={onMobileNavToggle}
        aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileNavOpen}
        aria-controls="crm-app-sidebar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden width="22" height="22">
          {isMobileNavOpen ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </>
          )}
        </svg>
      </IconButton>
      <SearchField label="Universal search" placeholder="Search leads, accounts, activities…" />
      <div className="crm-topbar-actions">
        <IconButton type="button" aria-label="Notifications">
          <span className="crm-bell-wrap" aria-hidden>
            <svg className="crm-bell-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="crm-bell-dot" />
          </span>
        </IconButton>
        <IconButton
          variant="theme"
          type="button"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          aria-label={mode === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          {mode === "light" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="18" height="18" aria-hidden>
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="18" height="18" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </IconButton>
        <div className="crm-user-chip">
          <span className="crm-avatar" aria-hidden>
            {initials(display)}
          </span>
          <div className="crm-user-meta">
            <span className="crm-user-name">{display}</span>
            <span className="crm-user-role">{user?.role?.replace(/_/g, " ") ?? ""}</span>
          </div>
          <Button type="button" variant="primaryCompact" className="crm-logout" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
