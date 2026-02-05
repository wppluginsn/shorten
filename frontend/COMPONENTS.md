# URL Shortener Frontend - React Components

This document describes all the React components and pages created for the URL Shortener application.

## 🎨 UI Components (`/src/components/`)

### Button.tsx
Reusable button component with multiple variants and loading states.
- **Variants**: `default`, `destructive`, `outline`, `ghost`, `link`
- **Sizes**: `default`, `sm`, `lg`, `icon`
- **Features**: Loading spinner, disabled state, full Tailwind customization

### Input.tsx
Customizable input field with label and error message support.
- **Props**: `label`, `error`, all standard HTML input attributes
- **Features**: Built-in error styling, focus states

### Card.tsx
Card container components for consistent content layout.
- **Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Features**: Hover effects, flexible layout options

### Header.tsx
Main navigation header with responsive menu and user authentication.
- **Features**: 
  - Logo and brand name
  - Desktop and mobile navigation
  - User menu dropdown
  - Conditional rendering based on auth state
  - Responsive hamburger menu

### StatsCard.tsx
Statistical display card for dashboard metrics.
- **Props**: `title`, `value`, `icon`, `trend` (optional)
- **Features**: Icon display, trend indicators (up/down arrows)

### LinkCard.tsx
Individual link display card with actions and metadata.
- **Features**:
  - Short URL display and copy
  - Original URL preview
  - Click count
  - Status indicators (active/inactive, password, expiration, geo-rules)
  - Actions: View analytics, Edit, Delete
  - Responsive design

### CountrySelector.tsx
Interactive country selector for geo-blocking configuration.
- **Features**:
  - Search functionality
  - Mode selection (Allow/Block)
  - Bulk actions (Select All, Clear All)
  - Visual country tags
  - 50+ predefined countries

### Toast.tsx & useToast.ts
Toast notification system using Radix UI.
- **Variants**: `default`, `destructive`, `success`
- **Features**: 
  - Auto-dismiss
  - Manual dismiss
  - Queue management (max 3 toasts)
  - Smooth animations

### Toaster.tsx
Toast container component that renders active toasts.

## 📄 Page Components (`/src/pages/`)

### LandingPage.tsx
Public landing page with hero section and quick URL shortener.
- **Features**:
  - Hero section with branding
  - Quick URL shortener (no auth required)
  - Feature grid showcasing app capabilities
  - CTA for registration
  - Success state with clipboard copy

### LoginPage.tsx
User authentication page.
- **Features**:
  - Email/password form with validation
  - Google OAuth button (placeholder)
  - Form validation using React Hook Form
  - Error handling
  - Link to registration page

### RegisterPage.tsx
User registration page.
- **Features**:
  - Name, email, password, confirm password fields
  - Form validation (password match, email format)
  - Google OAuth button (placeholder)
  - Error handling
  - Link to login page

### DashboardPage.tsx
Main dashboard with user overview and statistics.
- **Features**:
  - Stats cards (total links, clicks, avg clicks)
  - Activity chart (clicks over time using Recharts)
  - Top performing links list
  - Empty state with CTA
  - Quick navigation to create link

### CreateLinkPage.tsx
Comprehensive form for creating short links with advanced features.
- **Features**:
  - Basic information (URL, title, custom alias)
  - Security (password protection, expiration date)
  - Geo-blocking configuration
  - Form validation
  - Success redirect to analytics
  - Info tips and help text

### LinksPage.tsx
List/table view of all user's short links.
- **Features**:
  - Search functionality
  - Filter by status (all/active/inactive)
  - Pagination
  - Bulk operations support
  - Empty state
  - Actions per link (edit, delete, view analytics, copy)

### AnalyticsPage.tsx
Detailed analytics dashboard for a specific link.
- **Features**:
  - Link information display
  - Overview stats (total clicks, countries, devices)
  - Charts:
    - Clicks over time (line chart)
    - Top countries (bar chart)
    - Device types (pie chart)
    - Browsers (bar chart)
  - Recent activity log
  - Empty state for new links
  - Copy short URL functionality

### RedirectPage.tsx
Handles short code redirects to original URLs.
- **Features**:
  - Password protection handling
  - Geo-blocking detection
  - Loading state
  - Error handling (404, expired, access denied)
  - Automatic redirect on success

### BlockedPage.tsx
Access denied page for geo-blocked visitors.
- **Features**:
  - Clear explanation of why access is denied
  - Information about geo-blocking
  - Navigation options (homepage, go back)
  - Professional error messaging

## 🔧 Technical Details

### Dependencies Used
- **React 18+** - Core framework
- **TypeScript** - Type safety
- **React Router DOM** - Navigation and routing
- **React Hook Form** - Form management and validation
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **Zustand** - State management (via existing auth store)

### State Management
- **Auth Store** (`useAuthStore`): Global authentication state
- **Local State**: Component-level state using `useState`
- **Form State**: React Hook Form for form management

### API Integration
All components integrate with existing services:
- `authService` - Authentication operations
- `linkService` - Link CRUD operations
- `analyticsService` - Analytics data fetching

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`
- Hamburger menu for mobile navigation
- Responsive grids and layouts

### Error Handling
- Try-catch blocks for async operations
- Toast notifications for user feedback
- Error boundaries (can be added)
- Form validation errors

### Loading States
- Skeleton loaders (can be enhanced)
- Spinner animations
- Disabled states during operations
- Loading indicators on buttons

## 🎯 Usage Examples

### Importing Components
```typescript
import { Button, Input, Card } from '../components';
import { LandingPage } from '../pages';
```

### Using Toast Notifications
```typescript
import { toast } from '../components/useToast';

toast({
  title: 'Success!',
  description: 'Link created successfully',
  variant: 'success',
});
```

### Protected Routes
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📝 Notes

- All components use TypeScript for type safety
- Tailwind CSS classes are used for styling
- Components follow React best practices
- Accessibility features included (ARIA labels, keyboard navigation)
- Mobile-responsive design throughout
- Dark mode ready (CSS variables defined)

## 🔮 Future Enhancements

- Add QR code generation for links
- Implement bulk link operations
- Add export functionality for analytics
- Add link categories/tags
- Implement link templates
- Add A/B testing capabilities
- Enhanced security features (2FA, etc.)
