"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
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

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
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
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
        <div className="hidden flex-1 items-center justify-between md:ml-8 md:flex">
          <nav className="flex items-center gap-6 md:gap-8" aria-label="Main navigation">
            {navPaths.filter(({ href }) => !hiddenNavPaths.has(href)).map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  isNavActive(href)
                    ? "text-primary underline decoration-2 underline-offset-8"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            {!authLoading &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                  >
                    {t("profile")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link
                  href={loginPageHref}
                  className={`text-sm font-medium transition-colors ${
                    isNavActive("/login")
                      ? "text-primary underline decoration-2 underline-offset-8"
                      : "text-slate-600 hover:text-primary"
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
        <div className="min-h-0 overflow-hidden">
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
            {!authLoading && (
              user ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                    >
                      {t("profile")}
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                    >
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
              )
            )}
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
