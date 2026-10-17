# School Management and Classroom Platform
## Integrated SMS + Google Classroom-style Learning Features
**Admin, Teacher, Student, and Parent portals**  
*Draft v1.0*

### 1. Overview
This platform combines a school management system (SMS), which handles records, attendance, grading, fees, and administration, with a Google Classroom-style learning layer for classes, assignments, submissions, quizzes, and live lessons. Because both live in one system, rosters, schedules, grades, and attendance flow automatically between them, so teachers do not re-enter data and parents see one complete picture.

This document outlines the SMS features, the classroom features, how the two connect, the four user portals, the chosen technology stack (Next.js, Vercel, Supabase, Clerk, Stripe, and Resend), and a phased build plan.

### 2. Core SMS Features
#### Academic
- **Student information management**: profiles, enrollment records, guardian details, medical info, and documents
- **Admissions and enrollment**: online applications, entrance exam scheduling, status tracking, and section assignment
- **Class and timetable scheduling**: automated schedules, room and teacher allocation, conflict detection, and substitutes
- **Attendance tracking**: daily or per-subject, QR/RFID/biometric options, and parent absence alerts
- **Grading and report cards**: gradebooks, weighted grading, automated computation, and transcripts
- **Curriculum and lesson planning**: syllabus mapping, lesson plans, and learning outcomes
- **Exams and assessments**: scheduling, online quizzes, question banks, and result analysis

#### Administrative
- **Fee management and billing**: fee structures, installments, online payments, receipts, and scholarships
- **Staff and HR management**: teacher profiles, payroll, leave, evaluation, and workload
- **Library, inventory, transport, and hostel**: catalogs, assets, bus routes, and room allocation
- **Records and compliance**: certificates, IDs, official records, and audit logs

#### Communication and Engagement
- **Notifications**: SMS, email, and push alerts
- **Messaging**: teacher-parent chat, group messaging, and feedback channels
- **Events and calendar**: school events, holidays, meetings, and RSVPs
- **Behavior, guidance, and health**: incident logs, counselor notes, clinic visits, and vaccination records

#### Analytics and Technical
- **Dashboards and reports**: enrollment, attendance, finance, and performance; export to PDF, Excel, or CSV
- **Security**: role-based access, encryption, backups, audit trails, and Data Privacy Act compliance
- **Platform**: multi-campus support, mobile access, integrations, offline mode, and multilingual support

### 3. Classroom (Learning) Features
Modeled on Google Classroom, with the added advantage that class rosters and grades are tied directly to the SMS.

#### Classes and People
- **Class creation**: classes are created per subject and section, with optional class code or invite link for guests and co-teachers
- **Automatic rosters**: students and teachers are enrolled from SMS enrollment and teacher assignments, with no manual joining
- **Co-teachers and roles**: multiple teachers per class, plus teaching assistants with limited rights
- **Archive and reuse**: archive past classes, copy classes and materials to the next term

#### Stream and Communication
- **Class stream**: announcements, posts with attachments, scheduled posts, and reusable posts
- **Comments**: class comments (teacher can mute students) and private comments on individual work
- **Guardian summaries**: daily or weekly email or app digests of missing work, upcoming work, and class activity

#### Classwork
- **Topics and units**: organize materials and assignments by topic, week, or quarter
- **Assignments**: instructions, attachments, due dates, point values, draft and scheduled publishing, assign to all or selected students
- **Materials**: files, links, videos, and Google Drive or Docs content
- **Questions and quizzes**: short answer and multiple choice, auto-graded quizzes, question banks, timers, and optional locked mode
- **Rubrics**: reusable rubrics for consistent grading and clear student expectations

#### Submissions and Grading
- **Student submissions**: upload files, attach Drive or Docs, turn in, unsubmit, and resubmit where allowed
- **Status tracking**: assigned, turned in, missing, late, returned, and graded states with a teacher review queue
- **Feedback**: private comments, comment bank, and rubric-based scoring
- **Grade return and sync**: return work with feedback; scores sync to the SMS gradebook using the school's weights and grading period
- **Originality checks**: optional plagiarism or similarity report for written work

#### Live Learning and Student Tools
- **Live classes**: one-click video lesson link (Google Meet or an embedded video service) shown in the class and timetable
- **Automatic attendance**: joining a live session can mark attendance in the SMS, with teacher override
- **To-do and calendar**: student to-do list, due-date calendar, and optional Google Calendar sync
- **Offline and mobile**: view materials and draft answers offline, then sync when connectivity returns

### 4. How the SMS and Classroom Work Together
| Data flow | Direction | Result |
| :--- | :--- | :--- |
| Enrollment and sections | SMS to Classroom | Classes are populated automatically when students are enrolled or transferred |
| Teacher assignments and timetable | SMS to Classroom | Teachers get the right classes; live class links appear in schedules |
| Parent-student links | SMS to Classroom | Guardians receive summaries only for their own children |
| Assignment scores | Classroom to SMS | Scores feed the gradebook with weights and grading periods; report cards use final grades |
| Live class participation | Classroom to SMS | Attendance is recorded automatically and flagged for parent alerts |
| Missing or late work | Classroom to SMS | Triggers at-risk alerts, advisory notes, and parent notifications |
| Fee or account status | SMS to Classroom | Optional: restrict access or show reminders according to school policy |

### 5. User Portals
#### 5.1 Admin Portal
Full system control and oversight:
- User and role management: create accounts, assign permissions, reset passwords, view audit logs
- School setup: academic years, grade levels, sections, subjects, and grading policies
- Admissions and enrollment: review applications, approve enrollees, assign sections
- Scheduling: build timetables, allocate rooms and teachers, manage substitutes
- Finance: fee structures, payments, receipts, scholarships, and reports
- Staff management: teacher records, payroll, leave approvals, workload
- Records: official documents, report card release, transcripts, certificates
- Communication: announcements, event calendar, SMS/email broadcasts
- Analytics: enrollment, attendance, finance, and performance dashboards
- System settings: backups, integrations, notification templates, privacy controls
- Classroom oversight: class creation rules, term rollover and archiving, storage limits, and usage reports
- Google Workspace setup: domain sign-in, Drive and Meet settings, and account provisioning

#### 5.2 Teacher Portal
Classroom management and student assessment:
- My classes: assigned sections, class lists, and personal timetable
- Attendance: daily or per-subject marking with absence flags
- Gradebook: encode scores, weighted computation, submit final grades
- Lesson planning: syllabus, lesson plans, and materials upload
- Assignments and exams: create, distribute, collect, and grade work or quizzes
- Student insights: performance trends, at-risk alerts, behavior and incident logs
- Communication: message parents, post class announcements, schedule meetings
- Advisory tools: homeroom reports, report card comments, consultation notes
- Leave and requests: file leave, request substitutes, submit facility requests
- Classroom stream and classwork: post announcements, organize topics, and publish materials, assignments, and quizzes
- Grading workspace: review submissions, apply rubrics, give private feedback, and return work with scores syncing to the gradebook
- Live lessons: start a video class from the timetable, with automatic attendance capture

#### 5.3 Student Portal
Learning access and self-service:
- Dashboard: today's schedule, deadlines, and announcements
- Grades: current standing, per-subject breakdown, report card download
- Attendance: personal attendance record
- Learning materials: lessons, files, and links per subject
- Assignments and quizzes: view, submit, and receive feedback and scores
- Timetable and calendar: class schedule, exams, and school events
- Fees: balance and payment history
- Library: catalog search, borrowed books, and due dates
- Profile and requests: update contact info and request documents
- Messaging: contact teachers, with restrictions set by the school
- My classes: class stream, announcements, and classmates and teachers
- Classwork and to-do: assigned, missing, and done work, with due dates and topics
- Submit work: upload files or attach Drive items, turn in, and resubmit when allowed
- Live classes: join video lessons with one tap from the class or timetable

#### 5.4 Parent Portal
Visibility and communication, mostly read-only:
- Multi-child switching: one login for several children
- Academic monitoring: grades, report cards, and progress trends
- Attendance: daily status with instant absence or late alerts
- Fees and payments: balances, online payment, and receipts
- Schedules: class timetable, exam dates, and school calendar
- Behavior and health: discipline notes, clinic visits, vaccination records
- Communication: message teachers, request meetings, receive announcements
- Consent and forms: field trip permissions, event RSVPs, acknowledgments
- Transport: bus route and pick-up information
- Guardian summaries: daily or weekly digest of missing work, upcoming assignments, and class announcements per child
- Classwork visibility: read-only view of assignments, submission status, and returned grades

### 6. Cross-Portal Access Matrix
| Feature | Admin | Teacher | Student | Parent |
| :--- | :--- | :--- | :--- | :--- |
| Role-based login | Yes | Yes | Yes | Yes |
| Notifications | Yes | Yes | Yes | Yes |
| Announcements | Create | Create (class) | View | View |
| Messaging | Yes | Yes | Limited | Yes |
| Grades | Manage | Encode | View | View |
| Attendance | Monitor | Encode | View | View |
| Fees | Manage | None | View | View and pay |
| Create classes | Yes | Yes | None | None |
| Assignments | Monitor | Create and grade | Submit | View |
| Live classes | Monitor | Host | Join | None |
| Guardian summaries | Configure | Trigger | None | Receive |

### 7. Design and Security Notes
- Data scoping: parents see only their linked children, students only their own data, teachers only their assigned sections
- Privacy: comply with the Data Privacy Act, especially for minors' records, and keep audit logs on grade changes
- Mobile-first: parents and students will mostly use phones, so responsive design is essential
- Grade locking: allow admins to lock grades after the submission deadline to prevent unauthorized edits
- Student safety: private comments visible only to the teacher and student, moderated class discussions, and no direct student-to-student private messaging by default
- Storage and files: scan uploads for malware, set file size limits, and use expiring links for downloads

### 8. Technology Stack
- Framework: Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui
- Hosting: Vercel (Pro plan for production use)
- Authentication: Clerk
- Database and backend: Supabase (PostgreSQL, RLS, Realtime, Edge Functions, pg_cron)
- File storage: Supabase Storage
- Email: Resend with React Email templates
- Payments: Stripe (Checkout, payment links, webhooks) + Cashier manual payments
- SMS and push: SMS gateway interface (Semaphore/Twilio) + Web Push
- Real-time: Supabase Realtime
- Live video: VideoProvider (Google Meet / Embedded Jitsi / LiveKit)
- Reports and exports: @react-pdf/renderer for PDFs, ExcelJS for spreadsheets
- Monitoring: Sentry, Vercel Analytics, Supabase logs, and database trigger audit logs

### 9. Suggested Build Phases
- Phase 1 (MVP): Core records and basic classes (student records, attendance, grading & report cards, fee management, parent/student portal, role-based access, auto-created classes with stream, announcements, and simple assignments)
- Phase 2: Full classroom (submissions and grading workspace, rubrics, quizzes, grade sync to SMS gradebook, guardian summaries, to-do and calendar)
- Phase 3: Live and operations (live classes with auto attendance, Google Drive/Meet/Calendar integrations, scheduling, messaging)
- Phase 4: Expansion (library, transport, health and guidance, analytics dashboards, originality checks, offline mode)
