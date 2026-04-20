import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useMobileNavSwipe } from "./useMobileNavSwipe";

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(() => setMobileNavOpen((open) => !open), []);

  useMobileNavSwipe(mobileNavOpen, setMobileNavOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="crm-root">
      {mobileNavOpen ? (
        <button type="button" className="crm-nav-backdrop" aria-label="Close navigation menu" onClick={closeMobileNav} />
      ) : null}
      <Sidebar id="crm-app-sidebar" isMobileOpen={mobileNavOpen} onMobileNavigate={closeMobileNav} />
      <div className="crm-main">
        <TopBar isMobileNavOpen={mobileNavOpen} onMobileNavToggle={toggleMobileNav} />
        <main className="crm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
