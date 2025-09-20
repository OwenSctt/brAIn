import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database/schema';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('learning_modules')
      .select(`
        *,
        lessons (
          id,
          title,
          lesson_type,
          order_index,
          estimated_duration,
          is_required
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty_level', parseInt(difficulty));
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Get total count for pagination
    const { count } = await query.select('*', { count: 'exact', head: true });
    
    // Get paginated results
    const { data: modules, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching learning modules:', error);
      return NextResponse.json(
        { error: 'Failed to fetch learning modules' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: modules || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in learning modules API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    const {
      title,
      description,
      category,
      difficulty_level,
      estimated_duration,
      prerequisites = [],
      content_structure,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !difficulty_level || !estimated_duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['fundamentals', 'advanced', 'tools', 'projects'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate difficulty level
    if (difficulty_level < 1 || difficulty_level > 5) {
      return NextResponse.json(
        { error: 'Difficulty level must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { data: module, error } = await supabase
      .from('learning_modules')
      .insert({
        title,
        description,
        category,
        difficulty_level,
        estimated_duration,
        prerequisites,
        content_structure,
        is_published: false, // New modules start as unpublished
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating learning module:', error);
      return NextResponse.json(
        { error: 'Failed to create learning module' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: module }, { status: 201 });
  } catch (error) {
    console.error('Error in learning modules POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
