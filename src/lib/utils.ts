import { userPermissionsAtom } from "@/atoms/UserAtom";
import { PermissionEnum } from "@/interfaces/permission";
import { TimeSlot } from "@/interfaces/schedule";
import { ClassValue, clsx } from "clsx";
import { getDefaultStore } from "jotai";
import { FormEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormData(event: FormEvent): any {
  event.preventDefault();
  const formData = new FormData(event.target as any);
  return Object.fromEntries(formData);
}

export function getErrorMessage(error: any): string {
  const obj = error?.data?.error;
  const errorObj = error?.data;

  if (Array.isArray(errorObj)) return errorObj[0].errorMessage;

  if (obj === undefined)
    return error?.data?.message || error?.message || error?.status;
  const message = obj[Object.keys(obj)[0]];
  return message || error?.code;
}

// convert to title case
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// get user initials from first name and last name
export function getInitials(firstName?: string, lastName?: string): string {
  return (
    (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")
  ).toUpperCase();
}

// blob url to blob
export function getBlob(blobUrl: string): Promise<Blob> {
  return fetch(blobUrl).then((response) => response.blob());
}

// encode array
// given an array and param name convert to
// param name[0]=array[0]&param name[1]=array[1]...

export function encodeArray(
  array: any[],
  paramName: string
): { [key: string]: any } {
  return array.reduce((acc, curr, index) => {
    acc += `${paramName}=${curr}` + (index === array.length - 1 ? "" : "&");
    return acc;
  }, "");
}

export function buildQuery(
  searchParams:
    | {
        [key: string]: string | string[] | Date;
      }
    | any
) {
  return Object.keys(searchParams).reduce((acc, curr, index) => {
    const value = searchParams[curr];
    if (
      value === null ||
      value === undefined ||
      (!(value instanceof Date) && value?.length) === 0
    )
      return acc;
    if (Array.isArray(value)) {
      acc += encodeArray(value, curr);
    } else if (
      // if  value is a date
      // convert to iso string
      value instanceof Date
    ) {
      acc += `${curr}=${value.toISOString()}`;
    } else {
      acc += `${curr}=${value}`;
    }
    if (index !== Object.keys(searchParams).length - 1) {
      acc += "&";
    }
    return acc;
  }, "");
}

// generates pagination array
// has numbers and dots
// dots are generated when there are more than 5 pages
// input is current page and total pages

export function generatePaginationArray(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function checkIfUserHasPermission(
  requiredPermissions: PermissionEnum[],
  mode: "any" | "all" = "all"
): boolean {
  const userPermissions = getDefaultStore().get(userPermissionsAtom);

  const isAdmin = userPermissions.includes(PermissionEnum.AdminAccess);
  const result =
    mode === "all"
      ? requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        )
      : requiredPermissions.some((permission) =>
          userPermissions.includes(permission)
        );

  return isAdmin || result;
}

// input : array of number
// day names corresponding to the numbers
// full day names

export function getDayNames(days: number[]): string[] {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days.map((day) => dayNames[day]);
}

export function convertTimeSlot(t: { startTime: string; endTime: string }) {
  const startTime = t.startTime.split(":").map((x) => parseInt(x));
  const endTime = t.endTime.split(":").map((x) => parseInt(x));
  return {
    endHour: endTime[0],
    endMinute: endTime[1],
    startHour: startTime[0],
    startMinute: startTime[1],
  };
}

export function sortTimeSlots(timeSlots: TimeSlot[]) {
  return timeSlots.slice().sort((a, b) => {
    const aStart = parseInt(a.startTime.replace(":", ""));
    const bStart = parseInt(b.startTime.replace(":", ""));
    return aStart - bStart;
  });
}

export function addArrayToForm(
  formData: FormData,
  array: string[],
  paramName: string
) {
  array.forEach((item, index) => {
    formData.append(`${paramName}[${index}]`, item);
  });
}
