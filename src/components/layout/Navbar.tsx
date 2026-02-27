"use client";

import { useState, useCallback, useEffect, useLayoutEffect, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LocaleSwitcher,
  LocaleSwitcherFallback,
} from "@/components/layout/LocaleSwitcher";
import {
  clearAuthToken,
  fetchMe,
  getAuthToken,
  logout,
  type AuthUser,
} from "@/services/authService";

const navPaths = [
  { href: "/", key: "home" as const },
  { href: "/courses", key: "courses" as const },
  { href: "/articles", key: "articles" as const },
  { href: "/contact", key: "contact" as const },
] as const;

const hiddenNavPaths = new Set(["/contact", "/courses"]);

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-6 flex-col justify-center" aria-hidden>
      <span
        className={`block h-0.5 w-6 bg-slate-700 transition-all duration-200 ${
          open ? "translate-y-[3px] rotate-45" : ""
        }`}
      />
      <span
        className={`mt-1 block h-0.5 w-6 bg-slate-700 transition-all duration-200 ${
          open ? "-translate-y-[3px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function AccountDropdown({
  anchorRef,
  onClose,
  onLogout,
  profileLabel,
  logoutLabel,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onLogout: () => void;
  profileLabel: string;
  logoutLabel: string;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPos = useCallback(() => {
    if (!anchorRef.current) return { top: -9999, right: -9999 };
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  }, [anchorRef]);

  const [pos, setPos] = useState(getPos);

  useLayoutEffect(() => {
    setPos(getPos());
  }, [getPos]);

  useEffect(() => {
    const update = () => setPos(getPos());
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [getPos]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9999] min-w-[10rem] rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
      style={{ top: pos.top, right: pos.right }}
      role="menu"
    >
      <Link
        href="/profile"
        role="menuitem"
        onClick={onClose}
        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
      >
        {profileLabel}
      </Link>
      <button
        type="button"
        role="menuitem"
        onClick={onLogout}
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
      >
        {logoutLabel}
      </button>
    </div>,
    document.body
  );
}

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const accountBtnRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeAccountMenu = useCallback(() => setAccountMenuOpen(false), []);

  const loginPageHref = `/login?redirect_to=${encodeURIComponent(pathname)}`;
  const isNavActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  useEffect(() => {
    let active = true;

    const loadAuthUser = async () => {
      setAuthLoading(true);
      const token = getAuthToken();
      if (!token) {
        if (active) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      const me = await fetchMe(token);
      if (!active) return;

      if (!me) {
        clearAuthToken();
        setUser(null);
      } else {
        setUser(me);
      }
      setAuthLoading(false);
    };

    const onAuthChanged = () => {
      loadAuthUser();
    };

    loadAuthUser();
    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      active = false;
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const handleLogout = async () => {
    const token = getAuthToken();
    if (token) {
      await logout(token);
    }
    clearAuthToken();
    setUser(null);
    setMenuOpen(false);
    setAccountMenuOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 min-h-14 min-w-0 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90"
          onClick={closeMenu}
        >
          <Image
            src="/tiptop-logo.svg"
            alt="TipTop Education"
            width={140}
            height={40}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>

        {/* Desktop header: left menu + right auth/language */}
        <div className="hidden min-w-0 flex-1 items-center justify-between md:ml-8 md:flex">
          <nav className="flex items-center gap-6 md:gap-8" aria-label="Main navigation">
            {navPaths.filter(({ href }) => !hiddenNavPaths.has(href)).map(({ href, key }) => {
              const active = isNavActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center whitespace-nowrap border-b-2 pb-1.5 pt-1 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:text-primary"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-6">
            {!authLoading &&
              (user ? (
                <>
                  <button
                    ref={accountBtnRef}
                    type="button"
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1 rounded-md py-1.5 pr-1 text-sm font-medium text-slate-600 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={t("profile")}
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="max-w-[8rem] truncate">{user.name || t("profile")}</span>
                    <ChevronDown open={accountMenuOpen} />
                  </button>
                  {accountMenuOpen && (
                    <AccountDropdown
                      anchorRef={accountBtnRef}
                      onClose={closeAccountMenu}
                      onLogout={handleLogout}
                      profileLabel={t("profile")}
                      logoutLabel={t("logout")}
                    />
                  )}
                </>
              ) : (
                <Link
                  href={loginPageHref}
                  className={`inline-flex items-center whitespace-nowrap border-b-2 pb-1.5 pt-1 text-sm font-medium transition-colors ${
                    isNavActive("/login")
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:text-primary"
                  }`}
                >
                  {t("login")}
                </Link>
              ))}

            <Suspense
              fallback={
                <LocaleSwitcherFallback pathname={pathname} variant="desktop" />
              }
            >
              <LocaleSwitcher pathname={pathname} variant="desktop" />
            </Suspense>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile nav panel (grid collapse for smooth height animation) */}
      <div
        id="mobile-nav"
        className={`grid transition-[grid-template-rows] duration-200 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="min-h-0 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overflow-x-hidden">
          <nav
            className="border-t border-slate-200/80 bg-white px-4 py-4 shadow-sm"
            aria-label="Main navigation"
          >
          <ul className="flex flex-col gap-1">
            {navPaths.filter(({ href }) => !hiddenNavPaths.has(href)).map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isNavActive(href)
                      ? "bg-primary/10 text-primary underline decoration-2 underline-offset-4"
                      : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            {!authLoading &&
              (user ? (
                <>
                  <li className="mt-1 border-t border-slate-200/80 pt-2">
                    <Link
                      href="/profile"
                      onClick={() => {
                        closeMenu();
                        closeAccountMenu();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                    >
                      <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="min-w-0 truncate">{user.name || t("profile")}</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-500"
                    >
                      <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      {t("logout")}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href={loginPageHref}
                    onClick={closeMenu}
                    className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      isNavActive("/login")
                        ? "bg-primary/10 text-primary underline decoration-2 underline-offset-4"
                        : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    {t("login")}
                  </Link>
                </li>
              ))}
            <li className="mt-2 border-t border-slate-200/80 pt-3">
              <span className="mb-2 block px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                {t("language")}
              </span>
              <Suspense
                fallback={
                  <LocaleSwitcherFallback
                    pathname={pathname}
                    variant="mobile"
                    closeMenu={closeMenu}
                  />
                }
              >
                <LocaleSwitcher
                  pathname={pathname}
                  variant="mobile"
                  closeMenu={closeMenu}
                />
              </Suspense>
            </li>
          </ul>
        </nav>
        </div>
      </div>
    </header>
  );
}
