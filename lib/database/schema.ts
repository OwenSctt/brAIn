// Database schema types and interfaces for AI Learning App
// This file defines TypeScript types for all database tables and related structures

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          level: number;
          xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_modules: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'fundamentals' | 'advanced' | 'tools' | 'projects';
          difficulty_level: number;
          estimated_duration: number;
          prerequisites: string[];
          content_structure: ModuleContentStructure;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: 'fundamentals' | 'advanced' | 'tools' | 'projects';
          difficulty_level: number;
          estimated_duration: number;
          prerequisites?: string[];
          content_structure: ModuleContentStructure;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: 'fundamentals' | 'advanced' | 'tools' | 'projects';
          difficulty_level?: number;
          estimated_duration?: number;
          prerequisites?: string[];
          content_structure?: ModuleContentStructure;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          lesson_type: 'video' | 'exercise' | 'sandbox' | 'assessment' | 'reading';
          content: LessonContent;
          order_index: number;
          estimated_duration: number | null;
          is_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          lesson_type: 'video' | 'exercise' | 'sandbox' | 'assessment' | 'reading';
          content: LessonContent;
          order_index: number;
          estimated_duration?: number | null;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          lesson_type?: 'video' | 'exercise' | 'sandbox' | 'assessment' | 'reading';
          content?: LessonContent;
          order_index?: number;
          estimated_duration?: number | null;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          module_id: string | null;
          lesson_id: string | null;
          title: string;
          description: string | null;
          assessment_type: 'quiz' | 'practical' | 'coding' | 'prompt_evaluation';
          questions: AssessmentQuestions;
          passing_score: number;
          time_limit: number | null;
          max_attempts: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id?: string | null;
          lesson_id?: string | null;
          title: string;
          description?: string | null;
          assessment_type: 'quiz' | 'practical' | 'coding' | 'prompt_evaluation';
          questions: AssessmentQuestions;
          passing_score?: number;
          time_limit?: number | null;
          max_attempts?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string | null;
          lesson_id?: string | null;
          title?: string;
          description?: string | null;
          assessment_type?: 'quiz' | 'practical' | 'coding' | 'prompt_evaluation';
          questions?: AssessmentQuestions;
          passing_score?: number;
          time_limit?: number | null;
          max_attempts?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_streaks: {
        Row: {
          id: string;
          user_id: string;
          streak_type: 'daily_learning' | 'module_completion' | 'community_activity';
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          streak_type: 'daily_learning' | 'module_completion' | 'community_activity';
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          streak_type?: 'daily_learning' | 'module_completion' | 'community_activity';
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leaderboards: {
        Row: {
          id: string;
          user_id: string;
          leaderboard_type: 'xp' | 'streak' | 'modules_completed' | 'community_contributions';
          score: number;
          rank_position: number | null;
          period: 'daily' | 'weekly' | 'monthly' | 'all_time';
          calculated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          leaderboard_type: 'xp' | 'streak' | 'modules_completed' | 'community_contributions';
          score?: number;
          rank_position?: number | null;
          period: 'daily' | 'weekly' | 'monthly' | 'all_time';
          calculated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          leaderboard_type?: 'xp' | 'streak' | 'modules_completed' | 'community_contributions';
          score?: number;
          rank_position?: number | null;
          period?: 'daily' | 'weekly' | 'monthly' | 'all_time';
          calculated_at?: string;
        };
      };
      ai_tool_usage: {
        Row: {
          id: string;
          user_id: string;
          tool_name: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
          model_name: string;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          cost_usd: number;
          request_duration_ms: number | null;
          success: boolean;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_name: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
          model_name: string;
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
          cost_usd?: number;
          request_duration_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_name?: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
          model_name?: string;
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
          cost_usd?: number;
          request_duration_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          created_at?: string;
        };
      };
      prompt_templates: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          template_content: string;
          category: string;
          tags: string[];
          is_public: boolean;
          usage_count: number;
          rating_average: number;
          rating_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          template_content: string;
          category: string;
          tags?: string[];
          is_public?: boolean;
          usage_count?: number;
          rating_average?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          template_content?: string;
          category?: string;
          tags?: string[];
          is_public?: boolean;
          usage_count?: number;
          rating_average?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      module_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          lesson_id: string | null;
          completion_status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
          progress_percentage: number;
          time_spent: number;
          last_accessed: string;
          completed_at: string | null;
          score: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          lesson_id?: string | null;
          completion_status?: 'not_started' | 'in_progress' | 'completed' | 'skipped';
          progress_percentage?: number;
          time_spent?: number;
          last_accessed?: string;
          completed_at?: string | null;
          score?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          lesson_id?: string | null;
          completion_status?: 'not_started' | 'in_progress' | 'completed' | 'skipped';
          progress_percentage?: number;
          time_spent?: number;
          last_accessed?: string;
          completed_at?: string | null;
          score?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessment_results: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          score: number;
          max_score: number;
          percentage: number;
          passed: boolean;
          answers: any;
          time_taken: number | null;
          attempt_number: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id: string;
          score: number;
          max_score: number;
          percentage: number;
          passed: boolean;
          answers?: any;
          time_taken?: number | null;
          attempt_number?: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_id?: string;
          score?: number;
          max_score?: number;
          percentage?: number;
          passed?: boolean;
          answers?: any;
          time_taken?: number | null;
          attempt_number?: number;
          completed_at?: string;
        };
      };
      daily_challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          challenge_type: 'prompt_creation' | 'module_completion' | 'community_engagement' | 'ai_tool_usage';
          requirements: any;
          xp_reward: number;
          is_active: boolean;
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          challenge_type: 'prompt_creation' | 'module_completion' | 'community_engagement' | 'ai_tool_usage';
          requirements: any;
          xp_reward?: number;
          is_active?: boolean;
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          challenge_type?: 'prompt_creation' | 'module_completion' | 'community_engagement' | 'ai_tool_usage';
          requirements?: any;
          xp_reward?: number;
          is_active?: boolean;
          start_date?: string;
          end_date?: string;
          created_at?: string;
        };
      };
      user_daily_challenges: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          completed_at: string;
          xp_earned: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          completed_at?: string;
          xp_earned?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          completed_at?: string;
          xp_earned?: number;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'learning' | 'community' | 'technical' | 'milestone';
          icon: string;
          xp_reward: number;
          requirements: any;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          category: 'learning' | 'community' | 'technical' | 'milestone';
          icon: string;
          xp_reward?: number;
          requirements: any;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: 'learning' | 'community' | 'technical' | 'milestone';
          icon?: string;
          xp_reward?: number;
          requirements?: any;
          is_active?: boolean;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          prompt_text: string | null;
          category: string;
          tags: string[];
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          prompt_text?: string | null;
          category: string;
          tags?: string[];
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          prompt_text?: string | null;
          category?: string;
          tags?: string[];
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Content structure types
export interface ModuleContentStructure {
  sections: string[];
  learning_objectives?: string[];
  prerequisites?: string[];
  estimated_time?: number;
  difficulty?: number;
}

export interface LessonContent {
  // Video content
  video_url?: string;
  duration?: number;
  transcript?: string;
  
  // Exercise content
  instructions?: string;
  scenarios?: ExerciseScenario[];
  evaluation_criteria?: string[];
  
  // Sandbox content
  ai_models?: string[];
  scenarios?: string[];
  feedback_system?: boolean;
  hint_system?: boolean;
  
  // Reading content
  content?: string;
  key_concepts?: string[];
  
  // Assessment content
  questions?: AssessmentQuestion[];
  time_limit?: number;
  passing_score?: number;
}

export interface ExerciseScenario {
  task: string;
  hints?: string[];
  expected_output?: string;
  evaluation_criteria?: string[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'practical' | 'coding' | 'essay';
  question: string;
  options?: string[];
  correct_answer?: number | string;
  points: number;
  evaluation_criteria?: string[];
}

export interface AssessmentQuestions {
  questions: AssessmentQuestion[];
  total_points: number;
  time_limit?: number;
  passing_percentage?: number;
}

// User progress types
export interface UserProgress {
  module_id: string;
  lesson_id?: string;
  completion_status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  progress_percentage: number;
  time_spent: number;
  last_accessed: string;
  completed_at?: string;
  score?: number;
  notes?: string;
}

// Gamification types
export interface XPActivity {
  type: 'lesson_completion' | 'module_completion' | 'assessment_passed' | 'community_post' | 'daily_challenge';
  points: number;
  metadata?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'community' | 'technical' | 'milestone';
  icon: string;
  xp_reward: number;
  requirements: AchievementRequirements;
  is_active: boolean;
}

export interface AchievementRequirements {
  type: string;
  count?: number;
  category?: string;
  min_difficulty?: number;
  min_percentage?: number;
  min_days?: number;
  min_rating?: number;
  hours?: number;
  level?: number;
  amount?: number;
  streak_type?: string;
  [key: string]: any;
}

// Community types
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prompt_text?: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface PostComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

// AI Integration types
export interface AIToolUsage {
  tool_name: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
  model_name: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  request_duration_ms?: number;
  success: boolean;
  error_message?: string;
}

export interface PromptTemplate {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  template_content: string;
  category: string;
  tags: string[];
  is_public: boolean;
  usage_count: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Filter and search types
export interface ModuleFilters {
  category?: string;
  difficulty_level?: number;
  is_published?: boolean;
  search?: string;
}

export interface CommunityFilters {
  category?: string;
  tags?: string[];
  user_id?: string;
  search?: string;
  sort_by?: 'created_at' | 'likes_count' | 'comments_count';
  sort_order?: 'asc' | 'desc';
}

export interface LeaderboardFilters {
  type: 'xp' | 'streak' | 'modules_completed' | 'community_contributions';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  limit?: number;
}
