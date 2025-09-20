import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const moduleId = params.id;

    // Get module with lessons
    const { data: module, error: moduleError } = await supabase
      .from('learning_modules')
      .select(`
        *,
        lessons (
          id,
          title,
          description,
          lesson_type,
          content,
          order_index,
          estimated_duration,
          is_required,
          created_at,
          updated_at
        )
      `)
      .eq('id', moduleId)
      .eq('is_published', true)
      .single();

    if (moduleError) {
      console.error('Error fetching module:', moduleError);
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Sort lessons by order_index
    if (module.lessons) {
      module.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
    }

    return NextResponse.json({ data: module });
  } catch (error) {
    console.error('Error in module API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const moduleId = params.id;
    const body = await request.json();

    const {
      title,
      description,
      category,
      difficulty_level,
      estimated_duration,
      prerequisites,
      content_structure,
      is_published,
    } = body;

    // Validate category if provided
    if (category) {
      const validCategories = ['fundamentals', 'advanced', 'tools', 'projects'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    // Validate difficulty level if provided
    if (difficulty_level && (difficulty_level < 1 || difficulty_level > 5)) {
      return NextResponse.json(
        { error: 'Difficulty level must be between 1 and 5' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (difficulty_level !== undefined) updateData.difficulty_level = difficulty_level;
    if (estimated_duration !== undefined) updateData.estimated_duration = estimated_duration;
    if (prerequisites !== undefined) updateData.prerequisites = prerequisites;
    if (content_structure !== undefined) updateData.content_structure = content_structure;
    if (is_published !== undefined) updateData.is_published = is_published;

    const { data: module, error } = await supabase
      .from('learning_modules')
      .update(updateData)
      .eq('id', moduleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating module:', error);
      return NextResponse.json(
        { error: 'Failed to update module' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: module });
  } catch (error) {
    console.error('Error in module PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const moduleId = params.id;

    // First, delete all lessons associated with this module
    const { error: lessonsError } = await supabase
      .from('lessons')
      .delete()
      .eq('module_id', moduleId);

    if (lessonsError) {
      console.error('Error deleting lessons:', lessonsError);
      return NextResponse.json(
        { error: 'Failed to delete associated lessons' },
        { status: 500 }
      );
    }

    // Then delete the module
    const { error } = await supabase
      .from('learning_modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      console.error('Error deleting module:', error);
      return NextResponse.json(
        { error: 'Failed to delete module' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error in module DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
