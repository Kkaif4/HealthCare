// utils/responseFormatter.js
export const formatPlanResponse = (rawText) => {
    // Convert markdown headers to HTML
    let formatted = rawText
      .replace(/#{3,}/g, '') // Remove ### headers
      .replace(/#{2}(.+)/g, '<h3>$1</h3>') // ## → h3
      .replace(/#{1}(.+)/g, '<h2>$1</h2>') // # → h2
      
      // Convert lists
      .replace(/\n\s*-\s(.+)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      
      // Bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
  
    return formatted;
  };
