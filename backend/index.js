import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: false,
  })
);

const { Pool } = pkg;
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

async function ensureSchema() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      type TEXT,
      description TEXT,
      location TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT,
      suspended BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      name TEXT NOT NULL,
      registration_number TEXT UNIQUE NOT NULL,
      department TEXT,
      joined_year TEXT,
      email TEXT,
      suspended BOOLEAN DEFAULT FALSE,
      suspension_reason TEXT
    );
    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      member_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      marked_by TEXT,
      timestamp TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      committee_id TEXT NOT NULL,
      committee_name TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT,
      timestamp TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS announcement_comments (
      id TEXT PRIMARY KEY,
      announcement_id TEXT NOT NULL,
      user_id TEXT,
      user_name TEXT,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS permission_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT,
      reason TEXT NOT NULL,
      date TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      reported_by TEXT NOT NULL,
      reporter_name TEXT,
      reporter_role TEXT,
      member_id TEXT NOT NULL,
      member_name TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL,
      decision TEXT,
      decided_by TEXT,
      decided_at TEXT
    );
    CREATE TABLE IF NOT EXISTS case_comments (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      user_id TEXT,
      user_name TEXT,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT,
      category TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM companies`);
  if (rows[0].count === 0) {
    const c = {
      id: "1",
      name: "Tech Innovation Hub",
      email: "admin@techhub.com",
      phone: "+1 (555) 123-4567",
      type: "Technology Organization",
      description: "A community of tech enthusiasts and innovators",
      location: "San Francisco, CA",
      created_at: "2024-01-15T10:00:00",
    };
    await pool.query(
      `INSERT INTO companies(id,name,email,phone,type,description,location,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [c.id, c.name, c.email, c.phone, c.type, c.description, c.location, c.created_at]
    );
    const seedUsers = [
      { id: "1", company_id: "1", name: "Ellen CEO", email: "ceo@techhub.com", role: "ceo" },
      { id: "2", company_id: "1", name: "Jane Committee", email: "committee@techhub.com", role: "committee" },
      { id: "3", company_id: "1", name: "John Discipline", email: "discipline@techhub.com", role: "discipline" },
      { id: "4", company_id: "1", name: "Mark Member", email: "member@techhub.com", role: "member" },
    ];
    for (const u of seedUsers) {
      await pool.query(
        `INSERT INTO users(id,company_id,name,email,role) VALUES($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING`,
        [u.id, u.company_id, u.name, u.email, u.role]
      );
    }
    const seedMembers = [
      { id: "1", company_id: "1", name: "Alice Johnson", registration_number: "REG001", department: "Engineering", joined_year: "2023" },
      { id: "2", company_id: "1", name: "Bob Smith", registration_number: "REG002", department: "Marketing", joined_year: "2023" },
      { id: "3", company_id: "1", name: "Carol Williams", registration_number: "REG003", department: "Sales", joined_year: "2022" },
      { id: "4", company_id: "1", name: "David Brown", registration_number: "REG004", department: "Engineering", joined_year: "2023" },
      { id: "5", company_id: "1", name: "Emma Davis", registration_number: "REG005", department: "Operations", joined_year: "2021" },
      { id: "6", company_id: "1", name: "Frank Miller", registration_number: "REG006", department: "Marketing", joined_year: "2022" },
      { id: "7", company_id: "1", name: "Grace Wilson", registration_number: "REG007", department: "Design", joined_year: "2023" },
      { id: "8", company_id: "1", name: "Henry Moore", registration_number: "REG008", department: "Sales", joined_year: "2022" },
      { id: "9", company_id: "1", name: "Isabel Taylor", registration_number: "REG009", department: "Engineering", joined_year: "2021" },
      { id: "10", company_id: "1", name: "Jack Anderson", registration_number: "REG010", department: "Operations", joined_year: "2023" },
    ];
    for (const m of seedMembers) {
      await pool.query(
        `INSERT INTO members(id,company_id,name,registration_number,department,joined_year) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (registration_number) DO NOTHING`,
        [m.id, m.company_id, m.name, m.registration_number, m.department, m.joined_year]
      );
    }
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      for (const m of seedMembers) {
        const pres = Math.random() > 0.2 ? "present" : "absent";
        await pool.query(
          `INSERT INTO attendance_records(id,member_id,date,status,marked_by,timestamp) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
          [`${m.id}-${dateStr}`, m.id, dateStr, pres, "John Discipline", `${dateStr}T09:00:00`]
        );
      }
    }
    const ann = {
      id: "1",
      committee_id: "2",
      committee_name: "Jane Committee",
      title: "Welcome to New Semester",
      content: "We are excited to welcome everyone to the new academic semester.",
      category: "general",
      timestamp: "2024-11-10T09:00:00",
    };
    await pool.query(
      `INSERT INTO announcements(id,committee_id,committee_name,title,content,category,timestamp) VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [ann.id, ann.committee_id, ann.committee_name, ann.title, ann.content, ann.category, ann.timestamp]
    );
  }
}
ensureSchema().catch(() => {});

const companies = [
  {
    id: "1",
    name: "Tech Innovation Hub",
    email: "admin@techhub.com",
    phone: "+1 (555) 123-4567",
    type: "Technology Organization",
    description: "A community of tech enthusiasts and innovators",
    location: "San Francisco, CA",
    createdAt: "2024-01-15T10:00:00",
  },
];

const users = [
  { id: "1", companyId: "1", name: "Ellen CEO", email: "ceo@techhub.com", role: "ceo" },
  { id: "2", companyId: "1", name: "Jane Committee", email: "committee@techhub.com", role: "committee" },
  { id: "3", companyId: "1", name: "John Discipline", email: "discipline@techhub.com", role: "discipline" },
  { id: "4", companyId: "1", name: "Mark Member", email: "member@techhub.com", role: "member" },
];

const members = [
  { id: "1", companyId: "1", name: "Alice Johnson", registrationNumber: "REG001", department: "Engineering", joinedYear: "2023" },
  { id: "2", companyId: "1", name: "Bob Smith", registrationNumber: "REG002", department: "Marketing", joinedYear: "2023" },
  { id: "3", companyId: "1", name: "Carol Williams", registrationNumber: "REG003", department: "Sales", joinedYear: "2022" },
  { id: "4", companyId: "1", name: "David Brown", registrationNumber: "REG004", department: "Engineering", joinedYear: "2023" },
  { id: "5", companyId: "1", name: "Emma Davis", registrationNumber: "REG005", department: "Operations", joinedYear: "2021" },
  { id: "6", companyId: "1", name: "Frank Miller", registrationNumber: "REG006", department: "Marketing", joinedYear: "2022" },
  { id: "7", companyId: "1", name: "Grace Wilson", registrationNumber: "REG007", department: "Design", joinedYear: "2023" },
  { id: "8", companyId: "1", name: "Henry Moore", registrationNumber: "REG008", department: "Sales", joinedYear: "2022" },
  { id: "9", companyId: "1", name: "Isabel Taylor", registrationNumber: "REG009", department: "Engineering", joinedYear: "2021" },
  { id: "10", companyId: "1", name: "Jack Anderson", registrationNumber: "REG010", department: "Operations", joinedYear: "2023" },
];

const attendanceRecords = (() => {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    for (const m of members) {
      const pres = Math.random() > 0.2 ? "present" : "absent";
      out.push({
        id: `${m.id}-${dateStr}`,
        memberId: m.id,
        date: dateStr,
        status: pres,
        markedBy: "John Discipline",
        timestamp: `${dateStr}T09:00:00`,
      });
    }
  }
  return out;
})();

const announcements = [
  {
    id: "1",
    committeeId: "2",
    committeeName: "Jane Committee",
    title: "Welcome to New Semester",
    content: "We are excited to welcome everyone to the new academic semester.",
    category: "general",
    timestamp: "2024-11-10T09:00:00",
    comments: [],
  },
];

const permissionRequests = [];
const cases = [];
const passwordChangeRequests = [];
const ideas = [];

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email) {
    res.status(400).json({ error: "email_required" });
    return;
  }
  
  const find = async () => {
    if (pool) {
      const r = await pool.query(`SELECT * FROM users WHERE email=$1 LIMIT 1`, [email]);
      return r.rows[0];
    }
    return users.find((u) => u.email === email);
  };
  
  find()
    .then((dbUser) => {
      if (!dbUser) {
        res.status(404).json({ error: "user_not_found" });
        return;
      }
      
      // Check password if provided (for real authentication)
      if (password && dbUser.password_hash && dbUser.password_hash !== password) {
        res.status(401).json({ error: "invalid_credentials" });
        return;
      }
      
      // Return user data (excluding password)
      const user = {
        id: dbUser.id,
        companyId: dbUser.company_id || dbUser.companyId,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        suspended: dbUser.suspended || false
      };
      
      res.json({ user, token: uuid() });
    })
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.get("/companies", (req, res) => {
  if (!pool) {
    res.json(companies);
    return;
  }
  pool
    .query(`SELECT * FROM companies ORDER BY created_at DESC`)
    .then((r) => res.json(r.rows))
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.post("/companies", (req, res) => {
  const { name, email, phone, type, description, location } = req.body || {};
  if (!name || !email) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const c = {
    id: uuid(),
    name,
    email,
    phone: phone || "",
    type: type || "",
    description: description || "",
    location: location || "",
    createdAt: new Date().toISOString(),
  };
  if (!pool) {
    companies.push({ ...c, createdAt: c.createdAt });
    res.status(201).json(c);
    return;
  }
  pool
    .query(
      `INSERT INTO companies(id,name,email,phone,type,description,location,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [c.id, c.name, c.email, c.phone, c.type, c.description, c.location, c.createdAt]
    )
    .then((r) => res.status(201).json(r.rows[0]))
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.get("/members", (req, res) => {
  const { companyId } = req.query;
  if (!pool) {
    const list = companyId ? members.filter((m) => m.companyId === String(companyId)) : members;
    res.json(list);
    return;
  }
  const q = companyId ? `SELECT * FROM members WHERE company_id=$1 ORDER BY name ASC` : `SELECT * FROM members ORDER BY name ASC`;
  pool
    .query(q, companyId ? [String(companyId)] : [])
    .then((r) =>
      res.json(
        r.rows.map((m) => ({
          id: m.id,
          companyId: m.company_id,
          name: m.name,
          registrationNumber: m.registration_number,
          department: m.department,
          joinedYear: m.joined_year,
          email: m.email || undefined,
          suspended: !!m.suspended,
          suspensionReason: m.suspension_reason || undefined,
        }))
      )
    )
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.post("/members", (req, res) => {
  const { companyId, name, registrationNumber, department, joinedYear, email } = req.body || {};
  if (!companyId || !name || !registrationNumber) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const m = { id: uuid(), companyId, name, registrationNumber, department: department || "", joinedYear: joinedYear || "", email: email || "" };
  if (!pool) {
    members.push(m);
    res.status(201).json(m);
    return;
  }
  pool
    .query(
      `INSERT INTO members(id,company_id,name,registration_number,department,joined_year,email) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [m.id, m.companyId, m.name, m.registrationNumber, m.department, m.joinedYear, m.email || null]
    )
    .then((r) =>
      res.status(201).json({
        id: r.rows[0].id,
        companyId: r.rows[0].company_id,
        name: r.rows[0].name,
        registrationNumber: r.rows[0].registration_number,
        department: r.rows[0].department,
        joinedYear: r.rows[0].joined_year,
        email: r.rows[0].email || undefined,
      })
    )
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.patch("/members/:id", (req, res) => {
  const { id } = req.params;
  const { suspended, suspensionReason } = req.body || {};
  if (!pool) {
    const idx = members.findIndex((m) => m.id === id);
    if (idx < 0) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    members[idx] = { ...members[idx], suspended: Boolean(suspended), suspensionReason: suspensionReason || "" };
    res.json(members[idx]);
    return;
  }
  pool
    .query(`UPDATE members SET suspended=$1, suspension_reason=$2 WHERE id=$3 RETURNING *`, [
      Boolean(suspended),
      suspensionReason || null,
      id,
    ])
    .then((r) => {
      if (!r.rows[0]) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      const m = r.rows[0];
      res.json({
        id: m.id,
        companyId: m.company_id,
        name: m.name,
        registrationNumber: m.registration_number,
        department: m.department,
        joinedYear: m.joined_year,
        email: m.email || undefined,
        suspended: !!m.suspended,
        suspensionReason: m.suspension_reason || undefined,
      });
    })
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.get("/attendance", (req, res) => {
  const { date, memberId } = req.query;
  if (!pool) {
    let list = attendanceRecords;
    if (date) list = list.filter((r) => r.date === String(date));
    if (memberId) list = list.filter((r) => r.memberId === String(memberId));
    res.json(list);
    return;
  }
  const parts = [];
  const args = [];
  if (date) {
    args.push(String(date));
    parts.push(`date=$${args.length}`);
  }
  if (memberId) {
    args.push(String(memberId));
    parts.push(`member_id=$${args.length}`);
  }
  const where = parts.length ? `WHERE ${parts.join(" AND ")}` : "";
  pool
    .query(`
      SELECT 
        a.id,
        a.member_id,
        a.date,
        a.status,
        a.marked_by,
        a.timestamp,
        m.name as member_name,
        m.registration_number,
        m.department
      FROM attendance_records a
      LEFT JOIN members m ON a.member_id = m.id
      ${where ? 'WHERE ' + where.replace('WHERE ', '') : ''}
      ORDER BY a.date DESC, a.member_id ASC
    `, args)
    .then((r) =>
      res.json(
        r.rows.map((a) => ({
          id: a.id,
          memberId: a.member_id,
          memberName: a.member_name || `Member ${a.member_id}`,
          registrationNumber: a.registration_number || "",
          department: a.department || "",
          date: a.date,
          status: a.status,
          markedBy: a.marked_by || "",
          timestamp: a.timestamp,
        }))
      )
    )
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.post("/attendance", (req, res) => {
  const { records, date, markedBy } = req.body || {};
  if (!Array.isArray(records) || !date) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const ts = new Date().toISOString();
  const day = String(date);
  if (!pool) {
    for (let i = attendanceRecords.length - 1; i >= 0; i--) {
      if (attendanceRecords[i].date === day) attendanceRecords.splice(i, 1);
    }
    const created = records.map((r) => ({
      id: `${r.memberId}-${day}`,
      memberId: String(r.memberId),
      date: day,
      status: r.status === "present" ? "present" : "absent",
      markedBy: markedBy || "",
      timestamp: ts,
    }));
    attendanceRecords.push(...created);
    res.status(201).json(created);
    return;
  }
  pool
    .query(`DELETE FROM attendance_records WHERE date=$1`, [day])
    .then(async () => {
      const created = [];
      for (const r of records) {
        const idv = `${String(r.memberId)}-${day}`;
        const statusv = r.status === "present" ? "present" : "absent";
        await pool.query(
          `INSERT INTO attendance_records(id,member_id,date,status,marked_by,timestamp) VALUES($1,$2,$3,$4,$5,$6)`,
          [idv, String(r.memberId), day, statusv, markedBy || "", ts]
        );
        created.push({
          id: idv,
          memberId: String(r.memberId),
          date: day,
          status: statusv,
          markedBy: markedBy || "",
          timestamp: ts,
        });
      }
      res.status(201).json(created);
    })
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.get("/users", (req, res) => {
  const { companyId } = req.query;
  if (!pool) {
    const list = companyId ? users.filter((u) => u.companyId === String(companyId)) : users;
    res.json(list);
    return;
  }
  const q = companyId ? `SELECT * FROM users WHERE company_id=$1 ORDER BY name ASC` : `SELECT * FROM users ORDER BY name ASC`;
  pool
    .query(q, companyId ? [String(companyId)] : [])
    .then((r) => res.json(r.rows))
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.post("/users", (req, res) => {
  const { companyId, name, email, role, password } = req.body || {};
  if (!companyId || !name || !email || !role) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const id = uuid();
  const passwordHash = password ? password : null; // In production, you should hash the password
  
  if (!pool) {
    const u = { id, companyId: String(companyId), name, email, role, password: passwordHash };
    users.push(u);
    res.status(201).json({ id, companyId: String(companyId), name, email, role });
    return;
  }
  pool
    .query(`INSERT INTO users(id,company_id,name,email,role,password_hash) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,company_id,name,email,role`, [
      id,
      String(companyId),
      name,
      email,
      role,
      passwordHash,
    ])
    .then((r) => res.status(201).json({
      id: r.rows[0].id,
      companyId: r.rows[0].company_id,
      name: r.rows[0].name,
      email: r.rows[0].email,
      role: r.rows[0].role,
    }))
    .catch(() => res.status(500).json({ error: "server_error" }));
});
app.get("/announcements", (req, res) => {
  res.json(announcements);
});

app.post("/announcements", (req, res) => {
  const { committeeId, committeeName, title, content, category } = req.body || {};
  if (!committeeId || !title || !content) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const ann = { id: uuid(), committeeId: String(committeeId), committeeName: committeeName || "", title, content, category: category || "general", timestamp: new Date().toISOString(), comments: [] };
  announcements.unshift(ann);
  res.status(201).json(ann);
});

app.post("/announcements/:id/comments", (req, res) => {
  const { id } = req.params;
  const { userId, userName, content } = req.body || {};
  const ann = announcements.find((a) => a.id === id);
  if (!ann) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  const c = { id: uuid(), userId: String(userId || ""), userName: userName || "", content: content || "", timestamp: new Date().toISOString() };
  ann.comments = ann.comments || [];
  ann.comments.push(c);
  res.status(201).json(c);
});

app.get("/permissions", (req, res) => {
  if (!pool) {
    res.json(permissionRequests);
    return;
  }
  pool
    .query(`SELECT * FROM permission_requests ORDER BY timestamp DESC`)
    .then((r) =>
      res.json(
        r.rows.map((p) => ({
          id: p.id,
          userId: p.user_id,
          userName: p.user_name || "",
          reason: p.reason,
          date: p.date,
          timestamp: p.timestamp,
          status: p.status,
        }))
      )
    )
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.post("/permissions", (req, res) => {
  const { userId, userName, reason, date } = req.body || {};
  if (!userId || !reason || !date) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const pr = { 
    id: uuid(), 
    userId: String(userId), 
    userName: userName || "", 
    reason, 
    date: String(date), 
    timestamp: new Date().toISOString(), 
    status: "pending" 
  };
  
  if (!pool) {
    permissionRequests.unshift(pr);
    res.status(201).json(pr);
    return;
  }
  
  pool
    .query(
      `INSERT INTO permission_requests(id,user_id,user_name,reason,date,timestamp,status) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [pr.id, pr.userId, pr.userName, pr.reason, pr.date, pr.timestamp, pr.status]
    )
    .then((r) =>
      res.status(201).json({
        id: r.rows[0].id,
        userId: r.rows[0].user_id,
        userName: r.rows[0].user_name || "",
        reason: r.rows[0].reason,
        date: r.rows[0].date,
        timestamp: r.rows[0].timestamp,
        status: r.rows[0].status,
      })
    )
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.patch("/permissions/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const newStatus = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";
  
  if (!pool) {
    const idx = permissionRequests.findIndex((p) => p.id === id);
    if (idx < 0) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    permissionRequests[idx] = { ...permissionRequests[idx], status: newStatus };
    res.json(permissionRequests[idx]);
    return;
  }
  
  pool
    .query(`UPDATE permission_requests SET status=$1 WHERE id=$2 RETURNING *`, [newStatus, id])
    .then((r) => {
      if (!r.rows[0]) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      const p = r.rows[0];
      res.json({
        id: p.id,
        userId: p.user_id,
        userName: p.user_name || "",
        reason: p.reason,
        date: p.date,
        timestamp: p.timestamp,
        status: p.status,
      });
    })
    .catch(() => res.status(500).json({ error: "server_error" }));
});

app.get("/cases", (req, res) => {
  res.json(cases);
});

app.post("/cases", (req, res) => {
  const { companyId, reportedBy, reporterName, reporterRole, memberId, memberName, title, description, date } = req.body || {};
  if (!companyId || !reportedBy || !memberId || !title || !description || !date) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const c = { id: uuid(), companyId: String(companyId), reportedBy: String(reportedBy), reporterName: reporterName || "", reporterRole: reporterRole || "discipline", memberId: String(memberId), memberName: memberName || "", title, description, date: String(date), timestamp: new Date().toISOString(), status: "pending", comments: [] };
  cases.unshift(c);
  res.status(201).json(c);
});

app.post("/cases/:id/comments", (req, res) => {
  const { id } = req.params;
  const { userId, userName, content } = req.body || {};
  const c = cases.find((x) => x.id === id);
  if (!c) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  const cm = { id: uuid(), userId: String(userId || ""), userName: userName || "", content: content || "", timestamp: new Date().toISOString() };
  c.comments.push(cm);
  res.status(201).json(cm);
});

app.patch("/cases/:id/decision", (req, res) => {
  const { id } = req.params;
  const { decision, decisionText, decidedBy } = req.body || {};
  const idx = cases.findIndex((x) => x.id === id);
  if (idx < 0) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  const status = decision === "suspended" ? "suspended" : decision === "forgiven" ? "forgiven" : "pending";
  const decidedAt = new Date().toISOString();
  cases[idx] = { ...cases[idx], status, decision: decisionText || "", decidedBy: decidedBy || "", decidedAt };
  res.json(cases[idx]);
});

app.get("/ideas", (req, res) => {
  res.json(ideas);
});

app.post("/ideas", (req, res) => {
  const { userId, userName, category, title, description } = req.body || {};
  if (!userId || !title || !description) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  const idea = { id: uuid(), userId: String(userId), userName: userName || "", category: category || "suggestion", title, description, timestamp: new Date().toISOString(), status: "pending" };
  ideas.unshift(idea);
  res.status(201).json(idea);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  process.stdout.write(`attendance backend listening on http://localhost:${port}\n`);
});
