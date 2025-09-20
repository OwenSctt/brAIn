-- Seed data for learning modules and content
-- This script populates the database with initial learning content

-- Insert learning modules
INSERT INTO public.learning_modules (id, title, description, category, difficulty_level, estimated_duration, prerequisites, content_structure, is_published, created_by) VALUES
-- Fundamentals Module
('550e8400-e29b-41d4-a716-446655440001', 'AI Prompting Fundamentals', 'Master the basics of effective AI prompting with structured approaches and best practices.', 'fundamentals', 1, 120, '{}', '{"sections": ["Introduction to AI Prompting", "Prompt Structure", "Clarity and Specificity", "Context Setting", "Iterative Refinement"]}', true, null),

-- Advanced Techniques Module
('550e8400-e29b-41d4-a716-446655440002', 'Advanced Prompting Techniques', 'Learn sophisticated prompting strategies including chain-of-thought, few-shot learning, and role-playing.', 'advanced', 3, 180, '{"550e8400-e29b-41d4-a716-446655440001"}', '{"sections": ["Chain-of-Thought Prompting", "Few-Shot Learning", "Role-Playing Techniques", "Prompt Engineering Patterns", "Advanced Context Management"]}', true, null),

-- Tool-Specific Modules
('550e8400-e29b-41d4-a716-446655440003', 'ChatGPT Mastery', 'Comprehensive guide to maximizing ChatGPT effectiveness for development tasks.', 'tools', 2, 150, '{"550e8400-e29b-41d4-a716-446655440001"}', '{"sections": ["ChatGPT Interface", "Model Selection", "Conversation Management", "Code Generation", "Debugging Assistance", "Documentation Creation"]}', true, null),

('550e8400-e29b-41d4-a716-446655440004', 'Claude for Developers', 'Master Anthropic Claude for complex development scenarios and code analysis.', 'tools', 2, 150, '{"550e8400-e29b-41d4-a716-446655440001"}', '{"sections": ["Claude Interface", "Code Analysis", "Architecture Design", "Security Review", "Performance Optimization", "Documentation Writing"]}', true, null),

('550e8400-e29b-41d4-a716-446655440005', 'GitHub Copilot Integration', 'Learn to effectively use GitHub Copilot for accelerated development workflows.', 'tools', 2, 120, '{"550e8400-e29b-41d4-a716-446655440001"}', '{"sections": ["Copilot Setup", "Code Completion", "Function Generation", "Test Writing", "Refactoring", "Best Practices"]}', true, null),

-- Project-Based Modules
('550e8400-e29b-41d4-a716-446655440006', 'AI-Powered Debugging', 'Real-world scenarios for using AI tools to debug complex code issues.', 'projects', 3, 200, '{"550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440003"}', '{"sections": ["Error Analysis", "Log Investigation", "Performance Profiling", "Memory Leak Detection", "Security Vulnerability Assessment"]}', true, null),

('550e8400-e29b-41d4-a716-446655440007', 'Feature Development with AI', 'Complete feature development workflow using AI assistance for planning, coding, and testing.', 'projects', 4, 240, '{"550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"}', '{"sections": ["Requirements Analysis", "Architecture Design", "Implementation Planning", "Code Generation", "Testing Strategy", "Documentation"]}', true, null),

('550e8400-e29b-41d4-a716-446655440008', 'Data Analysis with AI', 'Use AI tools for data exploration, analysis, and visualization in development projects.', 'projects', 3, 180, '{"550e8400-e29b-41d4-a716-446655440001"}', '{"sections": ["Data Exploration", "Statistical Analysis", "Visualization", "Pattern Recognition", "Insight Generation", "Report Creation"]}', true, null);

-- Insert lessons for AI Prompting Fundamentals
INSERT INTO public.lessons (id, module_id, title, description, lesson_type, content, order_index, estimated_duration, is_required) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Introduction to AI Prompting', 'Understanding what AI prompting is and why it matters for developers.', 'reading', '{"content": "AI prompting is the art and science of communicating with artificial intelligence systems to achieve desired outcomes. For developers, mastering this skill can dramatically improve productivity and code quality.", "key_concepts": ["What is prompting", "Why it matters for developers", "Common misconceptions"]}', 1, 15, true),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Prompt Structure Basics', 'Learn the fundamental components of effective prompts.', 'video', '{"video_url": "/videos/prompt-structure-basics.mp4", "duration": 20, "transcript": "In this lesson, we explore the key components of effective prompts...", "exercises": [{"type": "multiple_choice", "question": "What are the three main components of a good prompt?", "options": ["Context, Task, Format", "Question, Answer, Example", "Input, Output, Process"], "correct": 0}]}', 2, 25, true),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Clarity and Specificity Exercise', 'Practice writing clear and specific prompts through hands-on exercises.', 'exercise', '{"instructions": "Write prompts for the following scenarios, focusing on clarity and specificity", "scenarios": [{"task": "Generate a function to sort an array", "hints": ["Specify the programming language", "Include input/output examples", "Mention performance requirements"]}, {"task": "Debug a JavaScript error", "hints": ["Include error message", "Provide code context", "Specify debugging approach"]}], "evaluation_criteria": ["Clarity of instructions", "Specificity of requirements", "Inclusion of context"]}', 3, 30, true),

('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Interactive Prompt Sandbox', 'Practice with real AI models in a controlled environment.', 'sandbox', '{"ai_models": ["gpt-3.5-turbo", "gpt-4"], "scenarios": ["Code generation", "Debugging", "Documentation"], "feedback_system": true, "hint_system": true}', 4, 40, true),

('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Fundamentals Assessment', 'Test your understanding of basic prompting principles.', 'assessment', '{"questions": [{"type": "multiple_choice", "question": "What is the most important aspect of a good prompt?", "options": ["Length", "Clarity", "Complexity", "Creativity"], "correct": 1}, {"type": "practical", "question": "Write a prompt to generate a REST API endpoint for user authentication", "evaluation": "Check for clarity, specificity, and completeness"}]}', 5, 20, true);

-- Insert lessons for Advanced Prompting Techniques
INSERT INTO public.lessons (id, module_id, title, description, lesson_type, content, order_index, estimated_duration, is_required) VALUES
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Chain-of-Thought Prompting', 'Learn to guide AI through step-by-step reasoning processes.', 'video', '{"video_url": "/videos/chain-of-thought.mp4", "duration": 25, "transcript": "Chain-of-thought prompting involves breaking down complex problems into smaller, manageable steps...", "examples": [{"problem": "Optimize this database query", "steps": ["Analyze current query", "Identify bottlenecks", "Propose optimizations", "Test performance"]}]}', 1, 30, true),

('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Few-Shot Learning Practice', 'Master the art of providing examples to improve AI responses.', 'exercise', '{"instructions": "Create few-shot examples for different development scenarios", "scenarios": ["Code review", "API design", "Error handling", "Testing"], "evaluation": "Quality and relevance of examples provided"}', 2, 35, true),

('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Role-Playing Techniques', 'Use AI as different personas to solve development challenges.', 'sandbox', '{"roles": ["Senior Developer", "Security Expert", "Performance Engineer", "UX Designer"], "scenarios": ["Code review", "Architecture decision", "Bug investigation", "Feature planning"], "feedback": true}', 3, 40, true);

-- Insert lessons for ChatGPT Mastery
INSERT INTO public.lessons (id, module_id, title, description, lesson_type, content, order_index, estimated_duration, is_required) VALUES
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'ChatGPT Interface Overview', 'Navigate and utilize ChatGPT features effectively.', 'video', '{"video_url": "/videos/chatgpt-interface.mp4", "duration": 15, "features": ["Conversation management", "Model selection", "Settings configuration"]}', 1, 20, true),

('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Code Generation with ChatGPT', 'Generate high-quality code using effective prompting strategies.', 'sandbox', '{"programming_languages": ["JavaScript", "Python", "TypeScript", "Go"], "code_types": ["Functions", "Classes", "APIs", "Tests"], "best_practices": true}', 2, 45, true),

('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Debugging with ChatGPT', 'Use ChatGPT to identify and fix code issues.', 'exercise', '{"bug_scenarios": ["Memory leaks", "Performance issues", "Logic errors", "Integration problems"], "debugging_process": ["Error analysis", "Root cause identification", "Solution implementation", "Testing"]}', 3, 50, true);

-- Insert assessments
INSERT INTO public.assessments (id, module_id, title, description, assessment_type, questions, passing_score, time_limit, max_attempts, is_published) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Fundamentals Knowledge Check', 'Test your understanding of basic prompting principles.', 'quiz', '{"questions": [{"id": 1, "type": "multiple_choice", "question": "What is the primary purpose of context in a prompt?", "options": ["To make it longer", "To provide background information", "To confuse the AI", "To save time"], "correct_answer": 1, "points": 10}, {"id": 2, "type": "multiple_choice", "question": "Which of the following makes a prompt more effective?", "options": ["Being vague", "Being specific", "Using complex language", "Being brief"], "correct_answer": 1, "points": 10}, {"id": 3, "type": "practical", "question": "Write a prompt to generate a function that validates email addresses", "points": 30, "evaluation_criteria": ["Clarity", "Specificity", "Expected output format"]}]}', 70, 30, 3, true),

('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Advanced Techniques Practical', 'Demonstrate your ability to use advanced prompting techniques.', 'practical', '{"scenarios": [{"task": "Use chain-of-thought to debug a complex algorithm", "evaluation": "Step-by-step reasoning quality"}, {"task": "Create few-shot examples for API documentation", "evaluation": "Example quality and relevance"}, {"task": "Use role-playing to design a system architecture", "evaluation": "Role appropriateness and solution quality"}]}', 75, 45, 2, true);

-- Insert daily challenges
INSERT INTO public.daily_challenges (id, title, description, challenge_type, requirements, xp_reward, is_active, start_date, end_date) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Prompt Master', 'Create and test 3 different prompts for code generation', 'prompt_creation', '{"min_prompts": 3, "categories": ["code_generation"], "quality_threshold": 0.8}', 150, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),

('880e8400-e29b-41d4-a716-446655440002', 'Module Explorer', 'Complete any learning module lesson', 'module_completion', '{"min_lessons": 1, "any_module": true}', 100, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),

('880e8400-e29b-41d4-a716-446655440003', 'Community Contributor', 'Share a helpful prompt template with the community', 'community_engagement', '{"min_posts": 1, "content_type": "prompt_template", "quality_rating": 4.0}', 200, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),

('880e8400-e29b-41d4-a716-446655440004', 'AI Tool Explorer', 'Use at least 2 different AI models in the playground', 'ai_tool_usage', '{"min_models": 2, "min_requests": 5}', 120, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day');
