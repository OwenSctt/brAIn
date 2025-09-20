# 🧠 brAIn - AI Learning Hub

A comprehensive, gamified learning platform designed to help developers master AI tools and effective prompting techniques. Built with Next.js 14, TypeScript, and Supabase.

![brAIn Logo](public/placeholder-logo.svg)

## ✨ Features

### 🎯 Gamification System
- **XP & Leveling** - Earn experience points and level up as you learn
- **Achievements** - Unlock badges for completing milestones
- **Leaderboards** - Compete with other learners
- **Daily Streaks** - Maintain consistent learning habits
- **Progress Tracking** - Visual progress indicators and statistics

### 📚 Learning Modules
- **Interactive Courses** - Hands-on learning with real-world examples
- **Multiple Difficulty Levels** - From beginner to expert
- **Prerequisites System** - Structured learning paths
- **Progress Tracking** - Track completion and performance
- **Skill Assessments** - Test your knowledge with practical evaluations

### 🧠 AI Playground
- **Multi-Model Support** - Test with GPT-3.5, GPT-4, Claude 3, and more
- **Interactive Sandbox** - Experiment with prompts in real-time
- **Cost Tracking** - Monitor API usage and costs
- **Prompt Templates** - Community-shared prompt examples
- **Performance Analytics** - Compare model responses and efficiency

### 👥 Community Features
- **Social Learning** - Share achievements and progress
- **Community Posts** - Ask questions and share insights
- **Following System** - Connect with other learners
- **Discussion Forums** - Engage in meaningful conversations

### 🎨 Modern UI/UX
- **Dark Theme** - Professional dark mode design
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Delightful user experience
- **Accessibility** - Built with accessibility in mind

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OwenSctt/brAIn.git
   cd brAIn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   ```bash
   # Run the database setup scripts in order:
   # 1. scripts/001_create_database_schema.sql
   # 2. scripts/002_create_profile_trigger.sql
   # 3. scripts/003_extend_database_schema.sql
   # 4. scripts/004_seed_learning_content.sql
   # 5. scripts/005_seed_achievements.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, CSS Variables
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (recommended)

### Project Structure
```
brAIn/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── modules/           # Learning modules
│   ├── playground/        # AI playground
│   └── community/         # Community features
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── gamification/     # XP, achievements, leaderboards
│   ├── learning/         # Learning-specific components
│   └── ai-integrations/  # AI tool components
├── lib/                  # Utilities and business logic
│   ├── database/         # Database schema and types
│   ├── gamification/     # XP and achievement systems
│   └── supabase/         # Supabase client configuration
├── scripts/              # Database setup scripts
└── public/               # Static assets
```

## 🎮 Usage

### Getting Started
1. **Sign Up** - Create your account to start learning
2. **Complete Profile** - Set up your learning preferences
3. **Choose a Module** - Select from available learning modules
4. **Start Learning** - Follow the interactive lessons
5. **Track Progress** - Monitor your XP, achievements, and streaks

### Learning Modules
- **Fundamentals** - Basic AI concepts and prompting
- **Advanced Techniques** - Complex prompting strategies
- **Tool Integration** - Working with various AI tools
- **Project Building** - Creating real-world applications

### AI Playground
- **Model Selection** - Choose from available AI models
- **Prompt Testing** - Experiment with different prompts
- **Response Analysis** - Compare and evaluate outputs
- **Cost Monitoring** - Track API usage and expenses

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Schema

The application uses a comprehensive database schema with the following main tables:

- **profiles** - User profiles and preferences
- **learning_modules** - Course content and metadata
- **lessons** - Individual lesson content
- **assessments** - Skill evaluations and tests
- **user_progress** - Learning progress tracking
- **achievements** - Gamification achievements
- **leaderboards** - Competitive rankings
- **ai_tool_usage** - API usage tracking
- **community_posts** - Social learning content

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI API Keys (for playground features)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Tailwind CSS
The project uses Tailwind CSS v4 with custom CSS variables for theming. The color scheme is defined in `app/globals.css`.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure responsive design
- Test across different browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Supabase** - The open source Firebase alternative
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Beautiful & consistent icon toolkit

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/OwenSctt/brAIn/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OwenSctt/brAIn/discussions)
- **Email**: [Contact Support](mailto:support@brain-learning.app)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Custom learning paths
- [ ] AI-powered recommendations
- [ ] Offline learning mode
- [ ] Multi-language support
- [ ] Enterprise features
- [ ] API for third-party integrations

---

**Built with ❤️ by the brAIn team**

*Master AI tools and effective prompting techniques with our comprehensive learning platform.*
