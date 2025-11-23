# FounderMind - AI-Powered Startup Simulation & Decision Engine

## Project Overview

FounderMind is an interactive web application where users run virtual startups with AI-powered board members, advisors, and team members based on real startup wisdom. Think "The Sims" meets "Y Combinator" meets "ChatGPT" - a place where aspiring founders can test ideas, learn from failures, and develop entrepreneurial skills without risking real capital.

## Vision & Unique Value Proposition

### Why This Project Matters
- **Learn by Doing**: Actually experience startup decisions in a safe environment
- **AI Mentorship**: Get advice from simulated "experienced" founders
- **Safe Failure**: Learn from mistakes without real consequences
- **Competitive Edge**: Battle other founders in real-time
- **Real Value**: Export actual business documents and strategies
- **Continuous Learning**: New scenarios added monthly

### Market Opportunity
- 582 million entrepreneurs worldwide
- $100B+ startup education market
- Gaming + Education = Explosive growth potential
- Network effects: Users share scenarios, compete, learn from each other

## Core Features

### 1. AI Board of Advisors
- **CEO Persona**: Strategic guidance based on collected wisdom
- **CTO Persona**: Technical architecture decisions
- **CFO Persona**: Financial modeling and burn rate management
- **CMO Persona**: Marketing strategy and growth hacking
- **Investor Persona**: Funding rounds and dilution scenarios

### 2. Startup Simulator Engine
- Start with an idea and $10K
- Make daily/weekly decisions
- Face realistic crises and opportunities
- Market dynamics that respond to your actions
- Competitor AI that adapts to your strategy

### 3. Multiplayer Founder Battles
- Compete in the same market
- Poach each other's employees
- Race to milestones
- Acquisition negotiations

### 4. Learning Mode
- Replay famous startup stories (Airbnb, Uber, etc.)
- "What would you do?" scenarios
- Post-mortem analysis with AI mentors
- Skill trees for different founder types

### 5. Reality Mode
- Connect real market data
- Test actual business ideas
- Generate real pitch decks
- Export learnings to actual business plans

## Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, React
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Backend**: Supabase (auth, database, real-time)
- **AI**: OpenAI API for AI personas
- **State Management**: Redis for game state caching
- **Hosting**: Vercel
- **Real-time**: Supabase Realtime for multiplayer features

### Project Structure

```
/app
  /api
    /simulation      # Game engine endpoints
    /ai              # Persona interactions
    /scenarios       # Scenario management
    /multiplayer     # Real-time features
  /(auth)
    /login
    /register
    /onboarding
  /(game)
    /dashboard
    /simulation
    /advisors
    /market
    /team
    /finances
    /compete
  /components
    /simulation      # SimulationEngine, MarketDynamics, CompetitorAI
    /advisors        # AdvisorChat, PersonaCard, DecisionTree
    /metrics         # BurnChart, GrowthChart, RunwayCalculator
    /team            # EmployeeCard, HiringPipeline, CultureMeter
    /ui              # Reusable UI components
  /lib
    /simulation      # Core game engine logic
    /ai              # AI persona system
    /multiplayer     # Multiplayer logic
    /scenarios       # Scenario engine
    /gamification    # Achievement and progression systems
    /analytics       # Metrics and analytics
  /data
    /personas        # AI advisor personalities
    /scenarios       # Historical startup stories
```

### Database Schema

#### Core Tables
- **users**: id, email, experience_points, skill_tree, founder_level
- **startups**: id, user_id, name, industry, stage, metrics, current_capital
- **decisions**: id, startup_id, type, choice, outcome, timestamp
- **scenarios**: id, title, description, difficulty, unlocked
- **advisor_interactions**: id, startup_id, persona, message, advice
- **market_events**: id, type, impact, triggered_by, timestamp
- **competitions**: id, players[], winner, market_snapshot, started_at

#### Metrics Tracked
- Burn rate
- Runway (months)
- MRR (Monthly Recurring Revenue)
- User growth rate
- Team morale
- Product quality
- Market share
- Valuation

## Design System

### Cyberpunk/Tech Aesthetic
- **Theme**: Dark mode by default
- **Colors**:
  - Primary: #00FFB2 (neon green)
  - Secondary: #FF00E5 (neon pink)
  - Accent: #00B2FF (neon blue)
  - Background: Dark grays/blacks
- **Style**:
  - Matrix-style data visualizations
  - Holographic UI elements
  - Glitch effects for critical events
  - Smooth animations with Framer Motion

## Development Phases

### Phase 1: Foundation & Core Simulation (Week 1-2)
- ✅ Project architecture setup
- Next.js 14 initialization
- Database schema creation
- Core simulation engine
- Basic UI components

### Phase 2: AI Advisor System (Week 2-3)
- AI persona implementation
- Natural conversation system
- Board meeting simulations
- Competitor AI

### Phase 3: Multiplayer & Competition (Week 3-4)
- Real-time multiplayer with Supabase
- Competition mechanics
- Social features
- Leaderboards

### Phase 4: Educational Content & Scenarios (Week 4-5)
- Scenario engine
- Famous startup stories
- Skill tree system
- Case study mode

### Phase 5: Gamification & Engagement (Week 5-6)
- Achievement system
- Progression mechanics
- Daily challenges
- Easter eggs

### Phase 6: Monetization & Premium Features (Week 6-7)
- Freemium tier implementation
- Premium features
- Virtual currency system
- Educational partnerships

### Phase 7: Data & Analytics (Week 7-8)
- Comprehensive analytics
- Player insights
- Export capabilities
- Business value generation

### Phase 8: Polish & Launch (Week 8)
- Performance optimization
- UI/UX polish
- Marketing site
- Launch strategy

## Monetization Strategy

### Pricing Tiers

**FREE**
- 1 active startup
- Basic advisors
- 5 scenarios
- Limited multiplayer

**FOUNDER ($9.99/mo)**
- 3 active startups
- All advisors
- All scenarios
- Unlimited multiplayer
- Advanced analytics

**ACCELERATOR ($29.99/mo)**
- Unlimited startups
- Custom advisors
- Create scenarios
- Private competitions
- API access
- White label for schools

### Additional Revenue Streams
- Virtual currency ("Founder Coins")
- Educational partnerships
- Corporate training packages
- Certification program

## Key Implementation Notes

### Simulation Engine
- Time progression system (days/weeks/months)
- Event-driven architecture
- Deterministic outcomes with randomness for replay value
- State persistence for save/load functionality

### AI Personas
- Context-aware (knows full startup state)
- Personality traits affect advice style
- Can have conflicting opinions in board meetings
- Learn from player patterns over time

### Multiplayer
- Real-time with Supabase Realtime
- Presence system for online players
- Shared market with competitive dynamics
- Spectator mode for learning

### Educational Value
- Export pitch decks, financial models, strategies
- Pattern recognition for player improvement
- Comparison to real startup success stories
- Certification upon completing scenarios

## Launch Strategy

1. **Product Hunt**: Feature launch with demo video
2. **Hacker News**: Show HN post with technical deep-dive
3. **Social Media**: Twitter/LinkedIn campaign targeting founders
4. **Partnerships**: Free access for startup accelerators
5. **Content Marketing**: Educational blog about startup decisions
6. **Community**: Discord/Slack for players to share strategies

## Success Metrics

- Daily Active Users (DAU)
- Average session length
- Completion rate of scenarios
- Conversion to paid tiers
- Educational outcomes (certifications, real startups launched)
- Community engagement (shared scenarios, competitions)

## Future Expansion Ideas

- Mobile apps (iOS/Android)
- VR mode for immersive board meetings
- Integration with real startup tools (Stripe, HubSpot, etc.)
- AI-generated custom scenarios based on current events
- Blockchain integration for NFT achievements
- API for third-party scenario creation

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component-driven development
- Test coverage for critical paths
- Documentation for complex algorithms

### Performance
- Optimize re-renders with React.memo
- Lazy load scenarios and heavy components
- Cache simulation states in Redis
- WebSocket connection pooling
- CDN for static assets

### Security
- Secure API endpoints with authentication
- Rate limiting on AI calls
- Input validation and sanitization
- Secure WebSocket connections
- Regular security audits

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database migrations
npm run db:migrate

# Seed database with scenarios
npm run db:seed
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
REDIS_URL=
NEXT_PUBLIC_APP_URL=
```

## Contributing

When working on this project:
1. Read this claude.md file first
2. Follow the phase-by-phase build guide
3. Maintain the cyberpunk aesthetic
4. Keep user experience paramount
5. Test multiplayer features thoroughly
6. Document AI persona behaviors

---

**Current Status**: Phase 1 - Foundation & Core Simulation
**Next Session**: Initialize Next.js project and create folder structure
