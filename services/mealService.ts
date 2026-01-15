import { supabase } from './supabaseClient';
import { Meal } from '../types';

export const getMeals = async (): Promise<Meal[]> => {
    const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        console.error('Error fetching meals from Supabase:', error);
        throw error;
    }

    return data || [];
};

export const addMealToSupabase = async (meal: Meal): Promise<Meal> => {
    const { data, error } = await supabase
        .from('meals')
        .insert([meal])
        .select()
        .single();

    if (error) {
        console.error('Error adding meal to Supabase:', error);
        throw error;
    }

    return data;
};

export const removeMealFromSupabase = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting meal from Supabase:', error);
        throw error;
    }
};
