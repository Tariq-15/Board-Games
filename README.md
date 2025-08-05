# BoardGameHub - HTML/CSS/JavaScript MVC Structure

This project has been converted from a Next.js React application to a traditional HTML, CSS, and JavaScript structure following the MVC (Model-View-Controller) pattern.

## Project Structure

```
/
├── index.html                 # Main HTML file
├── css/
│   ├── styles.css            # Base styles and layout
│   ├── components.css        # Component-specific styles
│   └── utilities.css         # Utility classes
├── js/
│   ├── models/               # Data models
│   │   ├── Game.js          # Game model
│   │   ├── User.js          # User model
│   │   └── Review.js        # Review model
│   ├── services/            # Business logic and data services
│   │   ├── AuthService.js   # Authentication service
│   │   └── GameService.js   # Game data service
│   ├── controllers/         # Application controllers
│   │   ├── HomeController.js # Home page controller
│   │   └── AuthController.js # Authentication controller
│   ├── views/               # UI rendering components
│   │   ├── GameView.js      # Game-related UI rendering
│   │   └── AuthView.js      # Authentication UI rendering
│   └── app.js               # Main application entry point
└── README.md                # This file
```

## MVC Architecture

### Models (Data Layer)
- **Game.js**: Represents game data with methods for formatting and validation
- **User.js**: Represents user data with authentication and role management
- **Review.js**: Represents review data with rating and date formatting

### Views (Presentation Layer)
- **GameView.js**: Handles rendering of games, categories, and reviews
- **AuthView.js**: Handles authentication UI, modals, and notifications

### Controllers (Business Logic Layer)
- **HomeController.js**: Manages home page functionality and event handling
- **AuthController.js**: Manages authentication logic and form handling

### Services (Data Access Layer)
- **AuthService.js**: Handles user authentication, registration, and session management
- **GameService.js**: Handles game data operations, filtering, and CRUD operations

## Features

### Authentication
- User registration and login
- Session management with localStorage
- Role-based access control (user/admin)
- Form validation and error handling

### Game Management
- Display featured games
- Game categories and filtering
- Search functionality
- Game details with reviews
- Similar games recommendations

### UI Components
- Responsive navigation with mobile menu
- Modal dialogs for authentication
- Loading states and error handling
- Star ratings and reviews
- Pagination for game lists

## Getting Started

1. **Open the project**: Simply open `index.html` in a web browser
2. **Test authentication**: 
   - Login: `admin@example.com` / `admin123` (admin user)
   - Login: `user@example.com` / `user123` (regular user)
3. **Explore features**: Browse games, test search, view categories

## Key Features

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly navigation

### Modern JavaScript
- ES6+ classes and modules
- Async/await for data operations
- Event-driven architecture

### CSS Architecture
- Utility-first approach
- Component-based styling
- Responsive breakpoints

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- Local storage for session management

## Development Notes

### Mock Data
The application uses mock data stored in the services. In a real application, these would be replaced with API calls to a backend server.

### Authentication
Currently uses localStorage for session management. In production, this should be replaced with secure server-side sessions.

### File Structure
The MVC structure separates concerns clearly:
- **Models**: Data structure and business logic
- **Views**: UI rendering and user interaction
- **Controllers**: Application flow and event handling
- **Services**: Data access and external API communication

## Future Enhancements

1. **Backend Integration**: Replace mock data with real API calls
2. **Database**: Implement proper data persistence
3. **Security**: Add proper authentication and authorization
4. **Performance**: Implement lazy loading and caching
5. **Testing**: Add unit tests for models and services
6. **Build Process**: Add bundling and optimization

## Credits

This project demonstrates a clean separation of concerns using the MVC pattern in vanilla JavaScript, making it easy to understand, maintain, and extend. 