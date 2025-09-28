# heyMemory - Memory Support Application

## Overview

heyMemory is a web-based memory support application designed to help people with cognitive challenges such as Alzheimer's disease, dementia, traumatic brain injury, and autism. The platform provides digital tools for memory training, face recognition practice, and storing important information. It features a caregiver portal for family members to manage content and supports users through adaptive, user-friendly interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation schemas
- **Accessibility**: WCAG compliant with screen reader support, keyboard navigation, and semantic HTML

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication with express-session and PostgreSQL session store
- **Security**: bcrypt for password hashing, rate limiting, CSRF protection, and security headers
- **File Upload**: Multer for handling image uploads (face photos and remember items)
- **Email**: Nodemailer for transactional emails (verification, password reset)

### Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema definition
- **Key Tables**:
  - Users table with email verification, admin roles, and profile fields
  - Face photos table for recognition training with relationships and descriptions
  - Remember items table for storing important information with categories
  - Sessions table for secure session storage

### Authentication & Authorization
- **Session Management**: Server-side sessions stored in PostgreSQL with configurable expiration
- **Email Verification**: Token-based email verification system with expiration
- **Password Security**: bcrypt hashing with salt rounds for secure password storage
- **Role-Based Access**: Admin and user roles with protected routes
- **Rate Limiting**: Express rate limiting for login attempts and API endpoints

### File Storage & Upload
- **Image Handling**: Multer middleware for secure file uploads with size and type validation
- **Storage Strategy**: Local file system storage with configurable upload directory
- **Image Processing**: Support for face photos and remember item images with metadata storage

### Progressive Web App Features
- **PWA Manifest**: Complete manifest.json for installable app experience
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Offline Considerations**: Service worker ready architecture for future offline functionality

### Cookie Management & Privacy
- **Cookie Consent**: GDPR-compliant cookie consent banner with granular preferences
- **Privacy Controls**: Separate consent categories for necessary, analytics, marketing, and preferences
- **Local Storage**: Consent preferences stored locally with expiration handling

### Email Integration
- **SMTP Configuration**: Configurable email service with authentication
- **Transactional Emails**: Welcome emails, verification, password reset, and contact form handling
- **Template System**: Structured email templates for consistent user communication

### Error Handling & Monitoring
- **Client-Side**: React error boundaries with user-friendly error messages
- **Server-Side**: Comprehensive error handling with appropriate HTTP status codes
- **Logging**: Structured logging for debugging and monitoring
- **Validation**: Zod schemas shared between client and server for consistent validation

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database Connection**: @neondatabase/serverless for optimized serverless connections

### Email Services
- **SMTP Provider**: Configurable SMTP service (default: smtp-auth.mailprotect.be)
- **Nodemailer**: Email sending library with authentication support

### UI & Design Libraries
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system

### Development & Build Tools
- **Vite**: Frontend build tool with HMR and optimization
- **Replit Integration**: Cartographer plugin for Replit-specific development features
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

### Authentication & Security
- **bcrypt**: Password hashing library
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store
- **express-rate-limit**: Rate limiting middleware

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library shared between client and server
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Context**: Client-side state for authentication and UI preferences