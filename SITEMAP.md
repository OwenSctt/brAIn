# 🗺️ brAIn Application Sitemap

## Public Routes
- `/` - Dashboard (Home)
- `/auth/login` - User Login
- `/auth/signup` - User Registration  
- `/auth/check-email` - Email Verification

## Protected Routes
- `/modules` - Learning Modules List
- `/modules/[id]` - Individual Module View
- `/playground` - AI Playground
- `/achievements` - User Achievements
- `/community` - Community Feed
- `/community/[id]` - Individual Post View
- `/profile` - User Profile

## API Endpoints
- `/api/learning-modules` - GET modules, POST create module
- `/api/learning-modules/[id]` - GET/PUT/DELETE specific module
- `/api/gamification` - XP, achievements, leaderboards
- `/api/ai-integrations` - AI tool management
- `/api/ai-integrations/test-prompt` - Test AI prompts
- `/api/test-prompt` - Legacy prompt testing

## Key Components by Page

### Dashboard (/)
- `Dashboard` - Main dashboard component
- `XPDisplay` - User progress display
- `AchievementBadge` - Recent achievements
- `Leaderboard` - Community rankings
- `Sidebar` - Navigation sidebar

### Learning Modules (/modules)
- `ModulesGrid` - Module cards display
- `ModuleFilters` - Search and filter
- `ModuleSidebar` - Module navigation

### AI Playground (/playground)
- `SandboxEditor` - Interactive AI testing
- `AIToolSelector` - Model selection
- `PromptTester` - Prompt experimentation

### Community (/community)
- `CommunityFeed` - Posts and discussions
- `CommunityFilters` - Content filtering
- `PostDetail` - Individual post view

### Achievements (/achievements)
- `AchievementsGrid` - Achievement display
- `AchievementBadge` - Individual badges
- `RecentAchievements` - Latest unlocks

## Navigation Structure
```
Sidebar
├── Dashboard (/)
├── Learning Modules (/modules)
├── AI Playground (/playground)
├── AI Tools (/ai-tools) - NOT IMPLEMENTED
├── Achievements (/achievements)
├── Community (/community)
├── Profile (/profile)
└── Settings (/settings) - NOT IMPLEMENTED
```

## Missing Pages/Features
- `/ai-tools` - AI Tools page (referenced in sidebar)
- `/settings` - Settings page (referenced in sidebar)
- AI Tools API endpoints
- Settings API endpoints
