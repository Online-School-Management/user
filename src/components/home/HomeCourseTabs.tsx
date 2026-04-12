"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Course } from "@/types/course";
import type { Subject } from "@/types/subject";
import { fetchCoursesForFilter } from "@/services/courseService";
import { CourseCard } from "@/components/courses/CourseCard";
import { UpcomingIcon, InProgressIcon, CompletedIcon } from "@/components/icons/SectionIcons";

type TabId = "upcoming" | "in_progress" | "completed";

const TAB_ORDER: TabId[] = ["upcoming", "in_progress", "completed"];

type SubjectFilterKey = "all" | number;

type TabDef = {
  id: TabId;
  labelKey: "tabUpcoming" | "tabInProgress" | "tabCompleted";
  emptyKey: "emptyUpcoming" | "emptyInProgress" | "emptyCompleted";
  Icon: typeof UpcomingIcon;
};

const TAB_DEFS: TabDef[] = [
  { id: "upcoming", labelKey: "tabUpcoming", emptyKey: "emptyUpcoming", Icon: UpcomingIcon },
  { id: "in_progress", labelKey: "tabInProgress", emptyKey: "emptyInProgress", Icon: InProgressIcon },
  { id: "completed", labelKey: "tabCompleted", emptyKey: "emptyCompleted", Icon: CompletedIcon },
];

type Props = {
  upcomingCourses: Course[];
  /** When omitted (classes page), status/subject changes load via API; home passes all three. */
  inProgressCourses?: Course[];
  completedCourses?: Course[];
  /** On the dedicated classes page, hide the "browse all" link in empty states (user is already there). */
  page?: "home" | "courses";
  /** When set (e.g. classes page), show subject filter tabs above the grid. */
  subjects?: Subject[];
};

function CourseGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3" aria-hidden>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm sm:h-80"
        />
      ))}
    </div>
  );
}

export function HomeCourseTabs({
  upcomingCourses,
  inProgressCourses,
  completedCourses,
  page = "home",
  subjects,
}: Props) {
  const t = useTranslations("Home");
  const baseId = useId();
  const [active, setActive] = useState<TabId>("upcoming");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilterKey>("all");

  const lazyMode = inProgressCourses === undefined && completedCourses === undefined;

  const [lazyList, setLazyList] = useState<Course[]>(() => upcomingCourses);
  const [lazyLoading, setLazyLoading] = useState(false);
  const lazyFirstHydrate = useRef(true);

  useEffect(() => {
    if (!lazyMode) return;
    let cancelled = false;

    const run = async () => {
      if (active === "upcoming" && subjectFilter === "all" && lazyFirstHydrate.current) {
        lazyFirstHydrate.current = false;
        if (!cancelled) setLazyList(upcomingCourses);
        return;
      }

      setLazyLoading(true);
      try {
        const data = await fetchCoursesForFilter({
          status: active,
          subjectId: subjectFilter === "all" ? undefined : subjectFilter,
        });
        if (!cancelled) setLazyList(data);
      } finally {
        if (!cancelled) setLazyLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [active, subjectFilter, lazyMode, upcomingCourses]);

  const coursesMap: Record<TabId, Course[]> = {
    upcoming: upcomingCourses,
    in_progress: inProgressCourses ?? [],
    completed: completedCourses ?? [],
  };

  const activeCourses = lazyMode ? lazyList : coursesMap[active];
  const activeEmptyKey = TAB_DEFS.find((d) => d.id === active)!.emptyKey;

  const displayCourses = useMemo(() => {
    if (lazyMode) return lazyList;
    const list = coursesMap[active];
    if (subjectFilter === "all") return list;
    return list.filter((c) => c.subject?.id === subjectFilter);
  }, [active, subjectFilter, lazyMode, lazyList, upcomingCourses, inProgressCourses, completedCourses]);

  const subjectKeys = useMemo<SubjectFilterKey[]>(() => {
    if (!subjects?.length) return [];
    return ["all", ...subjects.map((s) => s.id)];
  }, [subjects]);

  const focusTabIndex = useCallback(
    (index: number) => {
      const id = TAB_ORDER[index];
      const el = document.getElementById(`${baseId}-tab-${id}`);
      el?.focus();
    },
    [baseId]
  );

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (index + dir + TAB_ORDER.length) % TAB_ORDER.length;
        setActive(TAB_ORDER[next]);
        focusTabIndex(next);
      }
      if (e.key === "Home") {
        e.preventDefault();
        setActive(TAB_ORDER[0]);
        focusTabIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        const last = TAB_ORDER.length - 1;
        setActive(TAB_ORDER[last]);
        focusTabIndex(last);
      }
    },
    [focusTabIndex]
  );

  const focusSubjectTabIndex = useCallback(
    (index: number) => {
      const key = subjectKeys[index];
      if (key === undefined) return;
      const suffix = key === "all" ? "all" : String(key);
      document.getElementById(`${baseId}-subject-tab-${suffix}`)?.focus();
    },
    [baseId, subjectKeys]
  );

  const onSubjectTabKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (subjectKeys.length === 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (index + dir + subjectKeys.length) % subjectKeys.length;
        setSubjectFilter(subjectKeys[next]!);
        focusSubjectTabIndex(next);
      }
      if (e.key === "Home") {
        e.preventDefault();
        setSubjectFilter(subjectKeys[0]!);
        focusSubjectTabIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        const last = subjectKeys.length - 1;
        setSubjectFilter(subjectKeys[last]!);
        focusSubjectTabIndex(last);
      }
    },
    [focusSubjectTabIndex, subjectKeys]
  );

  const showSubjectTabs = Boolean(subjects && subjects.length > 0);

  const showLazyLoading = lazyMode && lazyLoading;
  const listForStatusEmpty = lazyMode ? lazyList : activeCourses;
  const emptyStatus =
    !showLazyLoading && subjectFilter === "all" && listForStatusEmpty.length === 0;
  const emptySubjectFilter =
    !showLazyLoading &&
    subjectFilter !== "all" &&
    (lazyMode ? lazyList.length === 0 : activeCourses.length > 0 && displayCourses.length === 0);
  const showGrid =
    !showLazyLoading && !emptyStatus && !emptySubjectFilter && displayCourses.length > 0;

  const selectedSubjectName = useMemo(() => {
    if (subjectFilter === "all") return null;
    return (subjects ?? []).find((s) => s.id === subjectFilter)?.name ?? t("subjectUnknown");
  }, [subjectFilter, subjects, t]);

  const subjectFilterEmptyMessage = useMemo(() => {
    if (selectedSubjectName == null) return null;
    const key =
      active === "upcoming"
        ? "emptyForSubjectUpcoming"
        : active === "in_progress"
          ? "emptyForSubjectInProgress"
          : "emptyForSubjectCompleted";
    return t(key, { subject: selectedSubjectName });
  }, [active, selectedSubjectName, t]);

  const subjectResultsHeading = useMemo(() => {
    if (selectedSubjectName == null) return null;
    const key =
      active === "upcoming"
        ? "resultsHeadingUpcoming"
        : active === "in_progress"
          ? "resultsHeadingInProgress"
          : "resultsHeadingCompleted";
    return t(key, { subject: selectedSubjectName });
  }, [active, selectedSubjectName, t]);

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("tablistLabel")}
        className="flex flex-wrap gap-2 border-b border-white/40 pb-3 sm:gap-3"
      >
        {TAB_DEFS.map(({ id, labelKey, Icon }, index) => {
          const isActive = active === id;
          const tabId = `${baseId}-tab-${id}`;
          return (
            <button
              key={id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel`}
              aria-busy={lazyMode && isActive ? lazyLoading : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              className={`inline-flex items-center gap-2 rounded-t-lg px-3 py-2.5 text-sm font-medium transition sm:px-4 ${
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon />
              <span>{t(labelKey)}</span>
            </button>
          );
        })}
      </div>

      {showSubjectTabs && (
        <div
          role="tablist"
          aria-label={t("subjectFilterLabel")}
          className="mt-4 flex flex-wrap gap-2 border-b border-white/40 pb-3 sm:gap-2"
        >
          {subjectKeys.map((key, index) => {
            const isActive = subjectFilter === key;
            const suffix = key === "all" ? "all" : String(key);
            const tabId = `${baseId}-subject-tab-${suffix}`;
            const label =
              key === "all"
                ? t("allSubjects")
                : (subjects ?? []).find((s) => s.id === key)?.name ?? "";
            return (
              <button
                key={suffix}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setSubjectFilter(key)}
                onKeyDown={(e) => onSubjectTabKeyDown(e, index)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                    : "bg-white/40 text-slate-700 ring-1 ring-white/50 backdrop-blur-sm hover:bg-white/55 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="pt-6"
      >
        {showLazyLoading ? (
          <div>
            <p className="mb-4 text-center text-sm text-slate-600">{t("loadingClasses")}</p>
            <CourseGridSkeleton />
          </div>
        ) : emptyStatus ? (
          <div className="rounded-2xl border border-dashed border-white/40 bg-white/40 px-6 py-14 text-center backdrop-blur-md sm:py-16">
            <p className="mx-auto max-w-md text-sm text-slate-600 sm:text-base">
              {t(activeEmptyKey)}
            </p>
            {page === "home" && (
              <Link
                href="/courses"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {t("browseAllCourses")}
              </Link>
            )}
          </div>
        ) : emptySubjectFilter ? (
          <div className="rounded-2xl border border-dashed border-white/40 bg-white/40 px-6 py-14 text-center backdrop-blur-md sm:py-16">
            <p className="mx-auto max-w-md text-sm text-slate-600 sm:text-base">
              {subjectFilterEmptyMessage}
            </p>
          </div>
        ) : showGrid ? (
          <div className="min-w-0">
            {subjectResultsHeading != null && (
              <p
                id={`${baseId}-subject-results-label`}
                className="mb-4 text-base font-semibold tracking-tight text-slate-900 sm:text-lg"
              >
                {subjectResultsHeading}
              </p>
            )}
            <div
              className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
              aria-labelledby={subjectResultsHeading != null ? `${baseId}-subject-results-label` : undefined}
            >
              {displayCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
