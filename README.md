# Threads Clone

A full-stack social media application built with modern web technologies, featuring real-time interactions, community management, and a sleek user interface.

## 🚀 Features

### Authentication & User Management
- **Secure Authentication**: Email, password, and social login integration with Clerk
- **Comprehensive Profile Management**: Complete user profile system with customizable settings
- **User Search & Discovery**: Advanced search functionality with pagination

### Thread & Community Features
- **Thread Creation**: Create and share threads with rich content
- **Nested Comments System**: Multi-level commenting with structured conversation flow
- **Community Management**: Create, join, and manage communities
- **Community Threads**: Dedicated threads for community discussions
- **Member Management**: Admin controls for community member roles and permissions

### Interactive Features
- **Real-time Notifications**: Activity page showing thread interactions
- **Advanced Search**: Search users and communities with pagination
- **File Uploads**: Seamless media sharing with UploadThing integration
- **Responsive Design**: Optimized for all device sizes

### Performance & Technical Features
- **Server Side Rendering**: Enhanced performance and SEO with Next.js SSR
- **Real-time Updates**: Webhook integration for live updates
- **Complex Data Relations**: Advanced MongoDB schemas with population
- **Form Validation**: Robust form handling with React Hook Form and Zod
- **Middleware & Security**: Comprehensive authorization and API protection

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **React Hook Form** - Efficient form management
- **Zod** - Schema validation

### Backend & Database
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling
- **Serverless APIs** - Next.js API routes

### Authentication & File Handling
- **Clerk** - Complete authentication solution
- **UploadThing** - File upload service
- **Webhooks** - Real-time event handling

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd threads-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # MongoDB Configuration
   MONGODB_URL=your_mongodb_connection_string

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

   # UploadThing Configuration
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

### Environment Variables Setup Guide

#### MongoDB Setup
1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster and database
3. Get your connection string and replace `MONGODB_URL`

#### Clerk Authentication Setup
1. Sign up at [Clerk](https://clerk.com/)
2. Create a new application
3. Copy the publishable and secret keys
4. Set up webhooks in Clerk dashboard for real-time updates

#### UploadThing Setup
1. Create an account at [UploadThing](https://uploadthing.com/)
2. Create a new app and get your API credentials
3. Configure file upload settings as needed

### Running the Application

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Build for production**
   ```bash
   npm run build
   npm start
   # or
   yarn build
   yarn start
   ```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── actions/          # Server actions
│   ├── models/           # Database models
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Next.js Configuration
The project uses Next.js 14+ with the following key configurations:
- Server Actions enabled
- Image optimization for external domains
- TypeScript configuration

### Database Schema
The application uses MongoDB with Mongoose for:
- User profiles and authentication
- Thread and comment relationships
- Community management
- Activity tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with user experience and scalability in mind
- Implements industry best practices for security and data management
