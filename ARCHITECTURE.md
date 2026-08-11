# ARCHITECTURE.md

# Al Bayan Education

Software Architecture Documentation

Version 1.0

---

# 1. Purpose

Dokumen ini menjelaskan arsitektur sistem Al Bayan Education secara menyeluruh.

Seluruh developer maupun AI Coding wajib mengikuti struktur yang dijelaskan pada dokumen ini.

Tidak diperbolehkan mengubah arsitektur tanpa alasan yang jelas.

---

# 2. Architecture Philosophy

Project dibangun menggunakan konsep Modular Monolith.

Alasan menggunakan Modular Monolith.

• Lebih sederhana dibanding Microservice.

• Lebih mudah dipelihara.

• Cocok untuk tim kecil.

• Mudah berkembang.

• Sangat cocok digunakan bersama Laravel.

Website tetap dipisahkan menjadi beberapa modul walaupun masih berada pada satu project.

---

# 3. High Level Architecture

Browser

↓

React + TypeScript

↓

Inertia.js

↓

Laravel

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Model

↓

PostgreSQL

↓

Redis

↓

Storage

---

# 4. Application Layers

Presentation Layer

↓

Business Layer

↓

Data Layer

↓

Infrastructure Layer

Setiap layer memiliki tanggung jawab yang berbeda.

Tidak boleh mencampurkan seluruh logic ke dalam Controller.

---

# 5. Frontend Architecture

Frontend menggunakan React.

Seluruh halaman berada pada.

resources/js

Struktur.

pages

components

layouts

hooks

services

utils

types

constants

assets

Frontend bertugas menampilkan UI.

Frontend tidak memiliki akses langsung ke Database.

---

# 6. Backend Architecture

Backend menggunakan Laravel.

Backend bertugas.

Authentication

Authorization

Validation

Business Logic

Email

Queue

Storage

Database

Backend menjadi pusat seluruh logic aplikasi.

---

# 7. Inertia Architecture

React tidak berkomunikasi langsung dengan API.

Flow.

Browser

↓

Inertia

↓

Laravel Route

↓

Controller

↓

Return Inertia Page

↓

React Render

Keuntungan.

Lebih sederhana.

SEO lebih baik.

Tidak perlu membuat REST API untuk kebutuhan internal.

---

# 8. Request Flow

User

↓

Browser

↓

Route

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Model

↓

PostgreSQL

↓

Response

↓

React

↓

Browser

---

# 9. Authentication Flow

Landing

↓

Login

↓

Laravel Validation

↓

Password Verify

↓

Redis Session

↓

Dashboard

---

# 10. Register Flow

Landing

↓

Register

↓

Validation

↓

Create User

↓

Create Student Profile

↓

Generate OTP

↓

Redis

↓

Laravel Mail

↓

Email User

↓

Verification

↓

Dashboard

---

# 11. Password Reset Flow

Forgot Password

↓

Input Email

↓

Generate OTP

↓

Redis

↓

Send Email

↓

Verify OTP

↓

New Password

↓

Hash Password

↓

Save PostgreSQL

↓

Login

---

# 12. Dashboard Architecture

Dashboard dibagi menjadi dua.

Dashboard Admin.

Dashboard Student.

Kedua dashboard menggunakan Layout yang berbeda.

Namun tetap memakai Design System yang sama.

---

# 13. Module Structure

Landing

Authentication

Dashboard

Programs

Gallery

Announcements

Contact

Settings

Notification

Setiap module memiliki.

Controller

Service

Repository

Model

Validation

Component

---

# 14. Folder Structure

app/

Http/

Models/

Services/

Repositories/

Policies/

Providers/

Observers/

Mail/

Notifications/

Jobs/

Events/

Listeners/

resources/

js/

components/

pages/

layouts/

hooks/

services/

utils/

types/

assets/

public/

image/

gallery/

program/

---

# 15. Layout Architecture

LandingLayout

AuthenticationLayout

DashboardLayout

Semua halaman wajib menggunakan Layout.

Tidak boleh membuat Navbar berulang.

Tidak boleh membuat Footer berulang.

---

# 16. Component Architecture

Atomic Design digunakan sebagai acuan.

Atoms

Button

Input

Badge

Avatar

Icon

Molecules

Card

Navbar Item

Gallery Card

Program Card

Search

Organisms

Navbar

Footer

Hero

Gallery

Program Section

Dashboard Statistic

Templates

Landing Layout

Dashboard Layout

Pages

Home

Login

Register

Dashboard

---

# 17. Service Architecture

Controller

↓

Service

↓

Repository

↓

Model

Controller tidak boleh membuat query.

Controller tidak boleh mengirim email.

Controller tidak boleh membuat OTP.

Semua dipindahkan ke Service.

---

# 18. Repository Architecture

Repository hanya mengakses database.

Repository tidak boleh.

Mengirim Email.

Mengakses Redis.

Menghasilkan PDF.

Mengirim Notification.

Repository hanya Query.

---

# 19. Database Architecture

Primary Database.

PostgreSQL.

Cache.

Redis.

Storage.

Laravel Storage.

Semua data permanen berada di PostgreSQL.

---

# 20. Redis Architecture

Redis digunakan untuk.

OTP

Session

Cache

Queue

Rate Limiter

Notification Cache

Redis tidak menyimpan data permanen.

---

# 21. Storage Architecture

public/

image/

logo.png

background1.mp4

gallery/

program/

Storage Laravel digunakan untuk upload di masa depan.

---

# 22. Security Architecture

HTTPS

CSRF

XSS Protection

SQL Injection Protection

Password Hash

Middleware

Policy

Gate

Rate Limiter

OTP Expiration

Session Validation

---

# 23. Queue Architecture

Redis Queue

↓

Supervisor

↓

Laravel Worker

↓

Email

↓

Notification

↓

Future Jobs

Seluruh pekerjaan berat menggunakan Queue.

---

# 24. Notification Architecture

System

↓

Notification Service

↓

Mail

↓

Database

↓

Future WhatsApp

↓

Future Push Notification

Notification dibuat fleksibel agar mudah dikembangkan.

---

# 25. Logging Architecture

Application Log

Authentication Log

Activity Log

Error Log

Queue Log

Email Log

Logging menggunakan Laravel.

---

# 26. Performance Architecture

Redis Cache

Lazy Loading

Code Splitting

Image Optimization

Video Metadata Preload

Database Index

Pagination

Compression

Brotli

Gzip

---

# 27. Deployment Architecture

Developer

↓

GitHub

↓

Server

↓

Pull

↓

Composer Install

↓

PNPM Build

↓

Laravel Optimize

↓

Queue Restart

↓

Application Online

---

# 28. Infrastructure

Ubuntu Server

↓

Nginx

↓

PHP-FPM

↓

Laravel

↓

PostgreSQL

↓

Redis

↓

Storage

↓

Cloudflare

↓

Internet

---

# 29. Scalability

Project dipersiapkan untuk.

1000+

Peserta

100+

Pengajar

20+

Admin

Puluhan ribu Gallery

Puluhan ribu Activity Log

Tanpa perubahan besar pada arsitektur.

---

# 30. Future Architecture

Arsitektur ini dipersiapkan agar dapat ditambahkan.

Learning Management System

Payment Gateway

Certificate Generator

Attendance

Online Class

Teacher Dashboard

Parent Dashboard

REST API

Mobile Application

Tanpa perlu membangun ulang sistem.

---

# 31. Architecture Principles

Single Responsibility

Separation of Concerns

Dependency Injection

Reusable Component

Service Layer

Repository Pattern

Clean Architecture

Performance First

Security First

Maintainability First

Scalability First

Developer Experience First

---

# End Architecture Documentation

Dokumen ini menjadi acuan utama seluruh struktur sistem Al Bayan Education.

Setiap fitur baru wajib mengikuti arsitektur yang telah ditentukan agar kualitas proyek tetap konsisten dari awal hingga pengembangan di masa depan.