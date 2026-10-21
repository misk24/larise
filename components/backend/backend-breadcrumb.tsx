"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { adminNavs, subpageNavs, userNavs } from "@/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

const themeNameCache = new Map<string, string>();
const THEME_CACHE_KEY = "admin_theme_name_cache";

interface BackendBreadcrumbProps {
  role: "user" | "admin";
}

export function BackendBreadcrumb({ role }: BackendBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});
  const [loadingLabels, setLoadingLabels] = useState<Record<string, boolean>>({});
  const loadedThemeIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (role !== "admin") return;
    try {
      const raw = sessionStorage.getItem(THEME_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, string>;
      Object.entries(parsed).forEach(([id, name]) => {
        if (id && name) themeNameCache.set(id, name);
      });
    } catch {
      // Ignore unavailable or invalid session cache.
    }
  }, [role]);

  useEffect(() => {
    if (role !== "admin" || !pathname) return;
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "admin") return;
    const themesIndex = parts.indexOf("themes");
    if (themesIndex < 0) return;
    const themeId = parts[themesIndex + 1];
    if (!themeId || themeId === "create") return;

    const cacheKey = `/admin/themes/${themeId}`;
    const cachedName = themeNameCache.get(themeId);
    if (cachedName) {
      setDynamicLabels((prev) =>
        prev[cacheKey] === cachedName ? prev : { ...prev, [cacheKey]: cachedName },
      );
      return;
    }
    if (loadedThemeIds.current.has(themeId)) return;

    const controller = new AbortController();
    loadedThemeIds.current.add(themeId);
    setLoadingLabels((prev) => ({ ...prev, [cacheKey]: true }));

    (async () => {
      try {
        const response = await fetch(`/api/admin/themes/${themeId}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        if (typeof data?.name !== "string" || !data.name) return;

        themeNameCache.set(themeId, data.name);
        try {
          const raw = sessionStorage.getItem(THEME_CACHE_KEY);
          const cache = raw ? (JSON.parse(raw) as Record<string, string>) : {};
          cache[themeId] = data.name;
          sessionStorage.setItem(THEME_CACHE_KEY, JSON.stringify(cache));
        } catch {
          // Session storage may be unavailable.
        }
        setDynamicLabels((prev) => ({ ...prev, [cacheKey]: data.name }));
      } catch {
        // Keep the route-derived fallback label when lookup fails.
      } finally {
        setLoadingLabels((prev) => ({ ...prev, [cacheKey]: false }));
      }
    })();

    return () => controller.abort();
  }, [pathname, role]);

  let pathAccumulator = "";
  const navItems = role === "admin" ? adminNavs : userNavs;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          pathAccumulator += `/${segment}`;
          const currentPath = pathAccumulator;
          const isLast = index === segments.length - 1;
          const match = navItems.find((item) => item.href === currentPath);
          let label =
            dynamicLabels[currentPath] ||
            match?.label ||
            (role === "user" ? subpageNavs[segment] : undefined) ||
            (/^[0-9]+$/.test(segment)
              ? `#${segment}`
              : segment.charAt(0).toUpperCase() + segment.slice(1));
          const isLoading = role === "admin" && loadingLabels[currentPath];

          return (
            <Fragment key={`${currentPath}-${index}`}>
              <BreadcrumbItem>
                {isLoading ? (
                  <Skeleton className="h-4 w-28" />
                ) : isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={currentPath}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
