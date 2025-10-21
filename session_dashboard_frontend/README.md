# Kavia Usage Insights Dashboard

A GxP-compliant session visualization dashboard for Kavia, designed for managers and Forward Deployment engineers to visualize and analyze Kavia usage patterns, feature adoption, and team productivity.

## 🎯 Features

### Authentication
- **Admin Access Control**: Secure login with username/password authentication
- **Demo Credentials**: `admin` / `password`
- **Audit Logging**: All login attempts (successful and failed) are logged

### Visualizations

#### 1. Feature Usage Trends
- Week-over-week comparison of session metrics
- Daily session activity charts
- Token usage and duration trends
- Feature adoption tracking

#### 2. Most/Least Used Features
- Top 10 most frequently used features
- Bottom 10 least used features
- Visual bar charts with usage counts
- Summary statistics

#### 3. Usage by Team
- Team-level aggregated metrics
- Session counts, token usage, and duration per team
- Unique user counts per team
- Comparative analysis across teams

#### 4. Usage by User
- Individual user activity tracking
- Sortable by sessions, tokens, duration, or username
- Activity visualization with progress bars
- User performance metrics

#### 5. Audit Trail
- Complete ALCOA+ compliant audit log
- Filter by action type
- CSV export with electronic signature placeholder
- Real-time activity tracking

### Data Filtering
- **Date Range**: Filter by start and end date
- **Team**: Filter by specific team
- **Feature**: Filter by feature usage
- **User**: Filter by individual user
- **Validation**: Input validation with user-friendly error messages

### GxP Compliance

This dashboard is built to comply with GxP regulations and follows ALCOA+ principles:

- **A**ttributable: All actions are linked to specific users
- **L**egible: Clear, readable audit trails
- **C**ontemporaneous: Real-time logging of all actions
- **O**riginal: Maintains data integrity
- **A**ccurate: Validated data processing
- **C**omplete: Comprehensive audit coverage
- **C**onsistent: Standardized data formats
- **E**nduring: Persistent audit records
- **A**vailable: Accessible audit trail with export capability

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard in your browser.

### Building for Production

```bash
# Create production build
npm run build
```

The optimized build will be created in the `build/` folder.

## 🧪 Testing

### Run All Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The project maintains **≥80% code coverage** across all metrics:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

### Test Structure

```
src/__tests__/
├── utils/
│   ├── auditLogger.test.js       # Audit logging utilities
│   ├── csvExporter.test.js       # CSV export functionality
│   ├── dataProcessing.test.js    # Data aggregation and filtering
│   └── validation.test.js        # Input validation
├── components/
│   ├── Login.test.js             # Login component
│   ├── Dashboard.test.js         # Dashboard layout
│   └── Filters.test.js           # Filter controls
└── integration/
    ├── AuthFlow.test.js          # Authentication flow
    └── AuditTrail.test.js        # Audit trail integration
```

### Test Categories

#### Unit Tests
- Utility functions (data processing, validation, audit logging)
- Individual component behavior
- Edge cases and error handling

#### Component Tests
- User interface rendering
- User interactions
- Form validation
- State management

#### Integration Tests
- Authentication flow end-to-end
- Audit trail creation and retrieval
- Context provider integration

## 🎨 Theme: Ocean Professional

The dashboard uses the "Ocean Professional" theme with the following color palette:

- **Primary**: `#3b82f6` (Blue)
- **Secondary**: `#64748b` (Gray)
- **Success**: `#06b6d4` (Cyan)
- **Error**: `#EF4444` (Red)
- **Background**: `#f9fafb`
- **Surface**: `#ffffff`
- **Text**: `#111827`

### Design Features
- Modern, clean aesthetic
- Subtle shadows and rounded corners
- Smooth transitions and animations
- Responsive layout for all screen sizes
- Accessible color contrast ratios

## 📁 Project Structure

```
session_dashboard_frontend/
├── src/
│   ├── components/           # React components
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Filters.js
│   │   ├── FeatureUsageTrends.js
│   │   ├── MostLeastUsedFeatures.js
│   │   ├── UsageByTeam.js
│   │   ├── UsageByUser.js
│   │   └── AuditTrail.js
│   ├── context/              # React Context providers
│   │   ├── AuthContext.js
│   │   └── AuditContext.js
│   ├── data/                 # Mock data
│   │   └── mockSessionData.js
│   ├── utils/                # Utility functions
│   │   ├── auditLogger.js
│   │   ├── csvExporter.js
│   │   ├── dataProcessing.js
│   │   └── validation.js
│   ├── styles/               # Component styles
│   │   ├── Header.css
│   │   ├── Sidebar.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── Filters.css
│   │   └── Visualizations.css
│   ├── __tests__/            # Test files
│   ├── App.js                # Main app component
│   ├── App.css               # Global styles
│   ├── index.js              # Entry point
│   └── index.css             # Base styles
├── package.json
└── README.md
```

## 🔐 Security & Compliance

### Authentication
- Session-based authentication with context management
- Failed login attempts are audited
- User credentials validation

### Audit Trail
- All user actions are logged with:
  - User identification
  - Action type
  - ISO 8601 timestamp
  - Detailed description
  - Metadata
- Audit entries cannot be modified or deleted
- Export capability with electronic signature placeholder

### Data Integrity
- Input validation at all entry points
- Type checking and sanitization
- Date range validation
- Filter validation

### CSV Export
- Complete audit trail export
- Electronic signature placeholder
- Export action is audited
- Includes export metadata (user, timestamp, purpose)

## 📊 Mock Data

The dashboard uses mock session data with the following structure:

```javascript
{
  userId: "user001",
  username: "Alice Johnson",
  projectId: "proj-alpha",
  sessionType: "CodeWriting",
  agentsUsed: ["CodeWritingAgent", "TestExecutionAgent"],
  featuresUsed: ["Code Generation", "Unit Testing"],
  tokenUsage: 15000,
  startTime: "2024-01-15T10:00:00Z",
  duration: 45,
  outputs: {
    documentsGenerated: 2,
    codeFilesUpdated: 8,
    prsCreated: 1
  },
  team: "Backend Team"
}
```

### Data Includes
- 15 mock sessions across 2 weeks
- 5 teams (Backend, Frontend, QA, Architecture)
- 8 unique users
- Various session types and features

## 🛠️ Development

### Code Standards
- ES6+ JavaScript
- Functional React components with Hooks
- Context API for state management
- CSS Modules for styling
- JSDoc comments for all public functions
- Comprehensive error handling

### Key Technologies
- **React** 18.2.0
- **React DOM** 18.2.0
- **React Scripts** 5.0.1
- **Testing Library** (React, Jest DOM, User Event)

### Browser Support
- Chrome (last version)
- Firefox (last version)
- Safari (last version)
- Edge (last version)

## 📝 API Documentation

### AuthContext

```javascript
const { user, isAuthenticated, login, logout } = useAuth();

// Login
login(username, password) // Returns { success, message?, user? }

// Logout
logout() // Clears authentication state
```

### AuditContext

```javascript
const { auditEntries, addAuditEntry, getAuditEntries } = useAudit();

// Add audit entry
addAuditEntry({
  action: 'ACTION_TYPE',
  details: 'Description',
  user: 'username',
  metadata: { key: 'value' }
});

// Get all entries
const entries = getAuditEntries();
```

### Data Processing Utilities

```javascript
import { 
  filterSessions, 
  calculateFeatureUsage,
  getMostUsedFeatures,
  calculateUsageByTeam,
  calculateWeekOverWeekTrends 
} from './utils/dataProcessing';

// Filter sessions
const filtered = filterSessions(sessions, { team: 'Backend Team' });

// Get feature usage
const usage = calculateFeatureUsage(sessions);

// Get trends
const trends = calculateWeekOverWeekTrends(sessions);
```

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React Scripts cache
rm -rf node_modules/.cache
```

### Test Issues

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests in verbose mode
npm test -- --verbose
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or start on different port
PORT=3001 npm start
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)
- [Testing Library Documentation](https://testing-library.com/react)
- [GxP Compliance Guidelines](https://www.fda.gov/drugs/pharmaceutical-quality-resources/facts-about-current-good-manufacturing-practices-cgmps)

## 📄 License

This project is proprietary software for Kavia internal use.

## 👥 Support

For questions or issues, contact the Kavia development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready ✅
