import React, { useEffect, useRef } from 'react';

interface WordCloudProps {
  words: { text: string; value: number }[];
  width?: number;
  height?: number;
}

export const WordCloud = ({ words, width = 500, height = 300 }: WordCloudProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || words.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Sort words by value (frequency)
    const sortedWords = [...words].sort((a, b) => b.value - a.value);
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Calculate the center of the canvas
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw the word cloud
    const maxFontSize = 48;
    const minFontSize = 12;
    const maxValue = sortedWords[0].value;
    
    // Color palette
    const colors = [
      '#4285F4', '#EA4335', '#FBBC05', '#34A853', 
      '#5E35B1', '#D81B60', '#039BE5', '#0097A7'
    ];
    
    // Keep track of placed words to avoid overlap
    const placedWords: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    
    // Function to check if a new word overlaps with existing words
    const checkOverlap = (x: number, y: number, width: number, height: number) => {
      for (const word of placedWords) {
        if (
          x < word.x + word.width &&
          x + width > word.x &&
          y < word.y + word.height &&
          y + height > word.y
        ) {
          return true; // Overlap detected
        }
      }
      return false; // No overlap
    };
    
    // Draw each word
    sortedWords.forEach((word, index) => {
      // Calculate font size based on frequency
      const fontSize = Math.max(
        minFontSize,
        Math.min(maxFontSize, (word.value / maxValue) * maxFontSize)
      );
      
      // Set font and color
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = colors[index % colors.length];
      
      // Measure text dimensions
      const textMetrics = ctx.measureText(word.text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      
      // Try to find a position for the word
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        // Calculate a position (spiral outward from center)
        const angle = (index + attempts) * 0.5;
        const radius = 5 + (attempts * 2);
        const x = centerX + Math.cos(angle) * radius - textWidth / 2;
        const y = centerY + Math.sin(angle) * radius + textHeight / 4;
        
        // Check if this position overlaps with existing words
        if (!checkOverlap(x - 2, y - textHeight, textWidth + 4, textHeight + 4)) {
          // Draw the word
          ctx.fillText(word.text, x, y);
          
          // Add to placed words
          placedWords.push({
            x: x - 2,
            y: y - textHeight,
            width: textWidth + 4,
            height: textHeight + 4
          });
          
          placed = true;
        }
        
        attempts++;
      }
      
      // If we couldn't place the word after max attempts, skip it
    });
    
  }, [words, width, height]);

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ width, height }}>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="bg-white rounded-lg shadow-sm"
    />
  );
};

export default WordCloud;
