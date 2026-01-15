import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, Check } from 'lucide-react';
import { analyzeMealWithGemini } from '../services/geminiService';
import { Meal } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';

const generateId = () => Math.random().toString(36).substring(2, 15);

interface AddMealProps {
  onAddMeal: (meal: Meal) => void;
  onClose: () => void;
}

const AddMeal: React.FC<AddMealProps> = ({ onAddMeal, onClose }) => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description && !selectedImage) {
      setError("Please provide a description or an image.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = selectedImage ? selectedImage.split(',')[1] : undefined;
      const result = await analyzeMealWithGemini(description, base64Data);

      const newMeal: Meal = {
        id: generateId(),
        name: result.name,
        timestamp: Date.now(),
        nutrition: result.nutrition,
        imageUrl: selectedImage || undefined,
        description: description || undefined,
        type: 'snack'
      };

      onAddMeal(newMeal);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to analyze meal");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="p-4 flex justify-between items-center bg-background/50 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight">Add Meal</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={24} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Image Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Food Photo (Optional)</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
              ${selectedImage ? 'border-transparent' : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'}
            `}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Selected" className="h-full w-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                  <p className="text-white font-medium">Change Photo</p>
                </div>
              </>
            ) : (
              <>
                <Camera size={32} className="text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">Tap to take a photo or upload</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              capture="environment"
            />
          </div>
        </div>

        {/* Text Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Grilled chicken breast with broccoli and rice..."
            className="h-32 resize-none"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-background safe-area-pb">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!description && !selectedImage)}
          className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Analyzing...
            </>
          ) : (
            <>
              <Check className="mr-2" /> Save Meal
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddMeal;
