# Overview

This repository contains educational projects from the Full Stack Open course by University of Helsinki. It showcases progressive web development learning through React frontend applications, Node.js/Express backend services, and MongoDB database integration. The projects demonstrate fundamental concepts like component-based UI development, REST API design, HTTP client communication, and server-side programming with comprehensive testing strategies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with Vite build tooling for fast development and hot module replacement
- **Component Structure**: Functional components using modern React hooks for state management
- **Styling**: CSS modules and inline styles for component-specific styling
- **Development Tools**: ESLint for code quality, modern JavaScript (ES modules)

## Backend Architecture
- **Server Framework**: Express.js for RESTful API development
- **Architecture Pattern**: MVC-style separation with dedicated routes, models, and controllers
- **Middleware**: Custom request logging, JSON parsing, and error handling middleware
- **Environment Configuration**: Environment-based configuration for development, testing, and production

## Data Management
- **Database**: MongoDB with Mongoose ODM for schema definition and data validation
- **Data Models**: Structured schemas for blogs, notes, and person records with automatic JSON transformation
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality across all data entities
- **Development Data**: JSON Server for frontend development and testing

## Testing Strategy
- **Testing Framework**: Node.js built-in test runner for backend unit and integration testing
- **Test Categories**: Unit tests for utility functions, integration tests for API endpoints
- **Test Data**: Dedicated test database configuration with automated test data setup
- **API Testing**: Supertest for HTTP endpoint testing and response validation

# External Dependencies

## Core Technologies
- **React 19**: Modern frontend framework with latest hooks and concurrent features
- **Express 5**: Latest version of Node.js web framework for robust API development
- **MongoDB Atlas**: Cloud-hosted MongoDB database service for production data storage
- **Mongoose 8**: Latest MongoDB object modeling library with enhanced TypeScript support

## Development Tools
- **Vite**: Fast build tool and development server for React applications
- **JSON Server**: Mock REST API server for frontend development and prototyping
- **ESLint 9**: Code linting with React-specific rules and modern JavaScript support
- **Morgan**: HTTP request logging middleware for Express applications

## HTTP and API Integration
- **Axios**: Promise-based HTTP client for API communication in React applications
- **CORS**: Cross-Origin Resource Sharing middleware for Express servers
- **Supertest**: HTTP assertion library for testing Express applications

## External Services
- **OpenWeatherMap API**: Weather data integration for countries application
- **REST Countries API**: Country information service for educational projects
- **GitHub API**: Repository synchronization through Octokit REST client

## Environment Management
- **dotenv**: Environment variable management for secure configuration
- **cross-env**: Cross-platform environment variable setting for development scripts