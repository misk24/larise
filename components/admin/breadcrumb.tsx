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
import { adminNavs } from "@/constants/backend";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const themeNameCache = new Map<string, string>();
const THEME_CACHE_KEY = "admin_theme_name_cache";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>(
    {},
  );
  const [loadingLabels, setLoadingLabels] = useState<Record<string, boolean>>(
    {},
  );
  const loadedThemeIds = useRef<Set<string>>(new Set());

  let pathAccumulator = "";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(THEME_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, string>;
      Object.entries(parsed).forEach(([id, name]) => {
        if (id && name) themeNameCache.set(id, name);
      });
    } catch {
      // ignore cache parse errors
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;
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
        prev[cacheKey] === cachedName
          ? prev
          : { ...prev, [cacheKey]: cachedName },
      );
      return;
    }

    if (loadedThemeIds.current.has(themeId)) return;

    const controller = new AbortController();
    loadedThemeIds.current.add(themeId);
    setLoadingLabels((prev) =>
      prev[cacheKey] ? prev : { ...prev, [cacheKey]: true },
    );

    (async () => {
      try {
        const res = await fetch(`/api/admin/themes/${themeId}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.name) return;
        themeNameCache.set(themeId, data.name);
        try {
          const raw = sessionStorage.getItem(THEME_CACHE_KEY);
          const parsed = raw ? (JSON.parse(raw) as Record<string, string>) : {};
          parsed[themeId] = data.name;
          sessionStorage.setItem(THEME_CACHE_KEY, JSON.stringify(parsed));
        } catch {
          // ignore cache write errors
        }

        setDynamicLabels((prev) => ({
          ...prev,
          [cacheKey]: data.name,
        }));
      } catch {
        // ignore fetch errors; fallback to default label
      } finally {
        setLoadingLabels((prev) =>
          prev[cacheKey] ? { ...prev, [cacheKey]: false } : prev,
        );
      }
    })();

    return () => controller.abort();
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          pathAccumulator += `/${segment}`;
          const isLast = index === segments.length - 1;
          const match = adminNavs.find((item) => item.href === pathAccumulator);
          let label: string;

          const dynamicLabel = dynamicLabels[pathAccumulator];
          const isLoading = loadingLabels[pathAccumulator];

          if (dynamicLabel) {
            label = dynamicLabel;
          } else if (match) {
            label = match.label;
          } else if (/^[0-9]+$/.test(segment)) {
            label = `#${segment}`;
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }

          const key = `${pathAccumulator}-${index}`;

          return (
            <React.Fragment key={key}>
              <BreadcrumbItem>
                {isLoading ? (
                  <Skeleton className="h-4 w-28" />
                ) : isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={pathAccumulator}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
