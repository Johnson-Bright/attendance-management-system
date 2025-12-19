import type { Member, AttendanceRecord, Announcement, PermissionRequest, Case, Idea, Company, User, Comment } from "./App";

const BASE_URL = "http://localhost:3001";

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `http_error_${res.status}`);
  }
  return res.json();
}

export async function login(email: string, password?: string): Promise<{ user: User; token: string }> {
  return request("/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function getCompanies(): Promise<Company[]> {
  return request("/companies");
}

export async function createCompany(data: Omit<Company, "id" | "createdAt">): Promise<Company> {
  return request("/companies", { method: "POST", body: JSON.stringify(data) });
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
