/**
 * @fileoverview API client for Attendance Management System
 * @description Centralized HTTP client with type-safe API calls
 * @author Attendance Management Team
 * @version 1.0.0
 */

import type { 
  Member, 
  AttendanceRecord, 
  Announcement, 
  PermissionRequest, 
  Case, 
  Company, 
  User, 
  Comment 
} from './App';

// Configuration constants
const BASE_URL = 'http://localhost:3001';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * HTTP request timeout in milliseconds
 */
const REQUEST_TIMEOUT = 10000;

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic HTTP request function with error handling
 * Factory Pattern: Creates standardized HTTP requests
 * @param path - API endpoint path
 * @param init - Fetch request options
 * @returns Promise resolving to parsed JSON response
 * @throws {ApiError} When request fails
 */
async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
      ...init,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}`,
        response.status,
        errorData?.code
      );
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT');
    }
    
    throw new ApiError('Network error', 0, 'NETWORK_ERROR');
  }
}

// Authentication API

/**
 * Authenticates user with email and optional password
 * @param email - User email address
 * @param password - User password (optional for demo mode)
 * @returns Promise resolving to user data and authentication token
 */
export async function login(
  email: string, 
  password?: string
): Promise<{ user: User; token: string }> {
  if (!email?.trim()) {
    throw new ApiError('Email is required', 400, 'INVALID_EMAIL');
  }
  
  return request('/login', { 
    method: 'POST', 
    body: JSON.stringify({ email: email.trim(), password }) 
  });
}

// Company Management API

/**
 * Retrieves all companies
 * @returns Promise resolving to array of companies
 */
export async function getCompanies(): Promise<Company[]> {
  return request<Company[]>('/companies');
}

/**
 * Creates a new company
 * @param data - Company data without id and createdAt
 * @returns Promise resolving to created company
 */
export async function createCompany(
  data: Omit<Company, 'id' | 'createdAt'>
): Promise<Company> {
  if (!data.name?.trim() || !data.email?.trim()) {
    throw new ApiError('Company name and email are required', 400, 'INVALID_DATA');
  }
  
  return request<Company>('/companies', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });
}

export async function getMembers(companyId?: string): Promise<Member[]> {
  const q = companyId ? `?companyId=${encodeURIComponent(companyId)}` : "";
  return request(`/members${q}`);
}

export async function createMember(data: Omit<Member, "id">): Promise<Member> {
  return request("/members", { method: "POST", body: JSON.stringify(data) });
}

export async function updateMember(id: string, data: Partial<Member>): Promise<Member> {
  return request(`/members/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function getAttendance(filters?: { date?: string; memberId?: string }): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (filters?.date) params.set("date", filters.date);
  if (filters?.memberId) params.set("memberId", filters.memberId);
  const q = params.toString() ? `?${params.toString()}` : "";
  return request(`/attendance${q}`);
}

export async function saveAttendance(records: { memberId: string; status: "present" | "absent" }[], date: string, markedBy: string): Promise<AttendanceRecord[]> {
  return request("/attendance", { method: "POST", body: JSON.stringify({ records, date, markedBy }) });
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return request("/announcements");
}

export async function publishAnnouncement(data: Omit<Announcement, "id" | "timestamp" | "comments">): Promise<Announcement> {
  return request("/announcements", { method: "POST", body: JSON.stringify(data) });
}

export async function addAnnouncementComment(announcementId: string, data: Omit<Comment, "id" | "timestamp">): Promise<Comment> {
  return request(`/announcements/${announcementId}/comments`, { method: "POST", body: JSON.stringify(data) });
}

export async function getPermissions(): Promise<PermissionRequest[]> {
  return request("/permissions");
}

export async function createPermission(data: Omit<PermissionRequest, "id" | "timestamp" | "status">): Promise<PermissionRequest> {
  return request("/permissions", { method: "POST", body: JSON.stringify(data) });
}

export async function updatePermission(id: string, status: PermissionRequest["status"]): Promise<PermissionRequest> {
  return request(`/permissions/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function getCases(): Promise<Case[]> {
  return request("/cases");
}

export async function createCase(data: Omit<Case, "id" | "timestamp" | "comments">): Promise<Case> {
  return request("/cases", { method: "POST", body: JSON.stringify(data) });
}

export async function addCaseComment(id: string, data: Omit<Comment, "id" | "timestamp">): Promise<Comment> {
  return request(`/cases/${id}/comments`, { method: "POST", body: JSON.stringify(data) });
}

export async function decideCase(id: string, decision: "suspended" | "forgiven", decisionText: string, decidedBy: string): Promise<Case> {
  return request(`/cases/${id}/decision`, { method: "PATCH", body: JSON.stringify({ decision, decisionText, decidedBy }) });
}

export async function getUsers(companyId?: string): Promise<User[]> {
  const q = companyId ? `?companyId=${encodeURIComponent(companyId)}` : "";
  return request(`/users${q}`);
}

export async function createUser(data: { companyId: string; name: string; email: string; role: User["role"]; password?: string }): Promise<User> {
  return request(`/users`, { method: "POST", body: JSON.stringify(data) });
}
