import { supabase } from './supabaseClient';
import { Meal } from '../types';

/**
 * Get the current authenticated user's ID
 * @returns User ID or null if not authenticated
 */
const getCurrentUserId = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
};

/**
 * Get all meals for the current authenticated user
 * RLS policies will automatically filter to only the user's meals
 */
export const getMeals = async (): Promise<Meal[]> => {
    const userId = await getCurrentUserId();
    
    if (!userId) {
        throw new Error('User must be authenticated to fetch meals');
    }

    const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

    if (error) {
        console.error('Error fetching meals from Supabase:', error);
        throw error;
    }

    return data || [];
};

/**
 * Add a meal for the current authenticated user
 * The user_id will be automatically set from the current session
 */
export const addMealToSupabase = async (meal: Meal): Promise<Meal> => {
    const userId = await getCurrentUserId();
    
    if (!userId) {
        throw new Error('User must be authenticated to add meals');
    }

    // Include user_id in the meal object
    const mealWithUserId = {
        ...meal,
        user_id: userId
    };

    const { data, error } = await supabase
        .from('meals')
        .insert([mealWithUserId])
        .select()
        .single();

    if (error) {
        console.error('Error adding meal to Supabase:', error);
        throw error;
    }

    return data;
};

/**
 * Remove a meal for the current authenticated user
 * RLS policies will ensure users can only delete their own meals
 */
export const removeMealFromSupabase = async (id: string): Promise<void> => {
    const userId = await getCurrentUserId();
    
    if (!userId) {
        throw new Error('User must be authenticated to delete meals');
    }

    const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Extra safety check (RLS will also enforce this)

    if (error) {
        console.error('Error deleting meal from Supabase:', error);
        throw error;
    }
};
