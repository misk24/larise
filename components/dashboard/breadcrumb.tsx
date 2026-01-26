"use client"

import React from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { subpageNavs, userNavs } from "@/constants/backend"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  let pathAccumulator = ""

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          pathAccumulator += `/${segment}`;
          const isLast = index === segments.length - 1

          const match = userNavs.find((item) => item.href === pathAccumulator)
          let label: string
          
          if (match) {
            label = match.label;
          } else if (subpageNavs[segment]) {
            label = subpageNavs[segment];
          } else if (/^[0-9]+$/.test(segment)) {
            label = `#${segment}`;
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }

          const key = `${pathAccumulator}-${index}`

          return (
            <React.Fragment key={key}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={pathAccumulator}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
