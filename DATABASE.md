# DATABASE.md

# Al Bayan Education

Database Architecture Documentation

Version 1.0

---

# 1. Database Philosophy

Database merupakan pusat seluruh informasi pada sistem Al Bayan Education.

Seluruh data permanen wajib disimpan pada PostgreSQL.

Redis hanya digunakan sebagai Memory Database untuk kebutuhan yang bersifat sementara.

Project ini dirancang agar database dapat berkembang selama bertahun-tahun tanpa perlu melakukan perubahan besar terhadap struktur tabel.

Seluruh tabel mengikuti prinsip Normalisasi.

Tidak diperbolehkan membuat satu tabel berisi seluruh data.

Setiap tabel hanya memiliki satu tanggung jawab.

---

# 2. Database Technology

Primary Database

PostgreSQL

Version

16+

Reason

- Open Source
- Stable
- Relationship sangat baik
- JSON Support
- Laravel Friendly
- High Performance
- Mudah di-scale

---

# 3. Cache Database

Redis

Version

7+

Redis digunakan untuk.

OTP

Session

Queue

Cache

Rate Limiter

Notification Cache

Dashboard Cache

Temporary Verification

Redis bukan database utama.

Tidak boleh menyimpan data permanen.

---

# 4. Database Structure

Database dibagi menjadi beberapa kelompok.

Authentication

Student

Content

Dashboard

System

Future Module

---

# 5. Authentication Tables

users

password_reset_tokens

sessions

personal_access_tokens

---

# 6. Student Tables

student_profiles

student_photos

student_settings

future_student_documents

future_student_payments

---

# 7. Content Tables

programs

gallery

announcements

faq

contact_messages

---

# 8. System Tables

jobs

failed_jobs

cache

cache_locks

notifications

activity_logs

---

# 9. Future Tables

learning_materials

attendance

assignments

certificates

payments

classes

teachers

parent_accounts

exam_results

Semua tabel future belum digunakan.

Namun struktur project sudah dipersiapkan.

---

# 10. Entity Relationship

users

↓

student_profiles

↓

student_settings

↓

student_photos

users

↓

notifications

programs

↓

announcements

gallery berdiri sendiri.

faq berdiri sendiri.

---

# 11. Users Table

Tabel users hanya menyimpan data autentikasi.

Kolom.

id

email

password

role

email_verified_at

remember_token

created_at

updated_at

Tidak boleh menyimpan data pribadi.

---

# 12. Student Profiles

Kolom.

id

user_id

full_name

nim

birth_date

gender

phone

address

photo

agreement

created_at

updated_at

Relasi.

user_id

mengacu ke

users.id

Relationship.

One To One.

---

# 13. Programs

Kolom.

id

title

slug

thumbnail

schedule

duration

description

status

created_at

updated_at

Status.

Draft

Published

Archived

---

# 14. Gallery

Kolom.

id

title

description

image

category

created_at

updated_at

Category.

Room

Kitchen

Bathroom

Garage

Facility

Outdoor

---

# 15. Announcements

Kolom.

id

title

slug

content

thumbnail

published_at

status

created_at

updated_at

---

# 16. Contact Messages

Kolom.

id

name

email

phone

subject

message

status

created_at

---

# 17. FAQ

Kolom.

id

question

answer

sort_order

created_at

updated_at

---

# 18. Notifications

Kolom.

id

user_id

title

message

type

read_at

created_at

Relationship.

Many To One

Users

---

# 19. Activity Logs

Kolom.

id

user_id

action

ip_address

device

browser

created_at

Activity Log digunakan untuk audit.

---

# 20. Password Reset

Menggunakan Laravel Password Reset.

Password tidak pernah dikirim melalui Email.

Email hanya mengirim OTP.

OTP disimpan di Redis.

---

# 21. OTP Strategy

Flow.

User

↓

Input Email

↓

Laravel

↓

Generate OTP

↓

Redis

↓

Laravel Mail

↓

Email User

OTP berlaku.

5 menit.

OTP otomatis dihapus setelah expired.

---

# 22. Login Flow

User

↓

Login

↓

Laravel

↓

PostgreSQL

↓

Password Verify

↓

Redis Session

↓

Dashboard

---

# 23. Register Flow

User

↓

Register

↓

Validation

↓

Users

↓

Student Profile

↓

Generate OTP

↓

Redis

↓

Email

↓

Verify

↓

Dashboard

---

# 24. Forgot Password

Email

↓

Generate OTP

↓

Redis

↓

Verify OTP

↓

New Password

↓

Hash Password

↓

Update PostgreSQL

↓

Login

---

# 25. PostgreSQL Index

Index wajib dibuat pada.

email

nim

slug

status

created_at

published_at

user_id

Foreign Key juga otomatis membuat index.

---

# 26. Foreign Keys

student_profiles.user_id

↓

users.id

notifications.user_id

↓

users.id

activity_logs.user_id

↓

users.id

---

# 27. Cascade Rules

Delete User

↓

Delete Student Profile

Delete Notification

Delete Activity

Menggunakan

Cascade Delete

Tidak meninggalkan orphan data.

---

# 28. Naming Convention

Table.

snake_case

Column.

snake_case

Foreign Key.

user_id

program_id

gallery_id

Tidak menggunakan CamelCase.

---

# 29. Migration Rules

Seluruh tabel dibuat menggunakan Migration Laravel.

Tidak membuat tabel manual melalui PgAdmin.

Migration wajib memiliki.

up()

down()

---

# 30. Seeder Rules

Seeder digunakan untuk.

Admin

FAQ

Program

Gallery

Announcement

Dummy User

Dummy Student

---

# 31. Factory Rules

Factory digunakan untuk.

Testing

Development

Demo

Tidak digunakan Production.

---

# 32. Query Rules

Gunakan Eloquent.

Gunakan Relationship.

Hindari Query Berulang.

Gunakan Eager Loading.

Gunakan Pagination.

Jangan menggunakan SELECT *.

---

# 33. Cache Rules

Data berikut wajib menggunakan Redis.

FAQ

Announcement

Gallery

Program

Dashboard Statistic

Navbar

Footer

---

# 34. Session Rules

Session Driver

Redis

Session Lifetime

120 menit

Remember Me

30 hari

---

# 35. Queue Rules

Queue Driver

Redis

Queue digunakan untuk.

Email OTP

Notification

Future Broadcast

Certificate

PDF

---

# 36. Backup Strategy

Backup PostgreSQL.

Harian.

Backup Redis.

Tidak diperlukan.

Karena hanya cache.

Backup disimpan minimal.

30 hari.

---

# 37. Restore Strategy

Restore menggunakan.

pg_restore

Backup diuji secara berkala.

---

# 38. Performance Strategy

Gunakan.

Index

Redis Cache

Pagination

Lazy Loading

Query Optimization

Connection Pool

---

# 39. Security Strategy

Password.

Hash Laravel.

Tidak plaintext.

OTP.

Redis.

HTTPS.

Wajib.

Input.

Validation.

Prepared Statement.

CSRF.

Enabled.

---

# 40. Future Scalability

Database dipersiapkan untuk.

1000+

Mahasiswa

100+

Pengajar

20+

Admin

10000+

Gallery

50000+

Activity Logs

Arsitektur masih mampu berkembang menjadi.

LMS

Payment

Attendance

Certificate

Online Exam

Tanpa mengubah struktur utama database.

---

# Database Principles

Single Responsibility.

Normalization.

Relationship First.

Performance First.

Security First.

Scalability First.

Maintainability First.

Semua perubahan database wajib dilakukan menggunakan Migration agar histori perubahan tetap terdokumentasi dengan baik.

---

# End Database Documentation