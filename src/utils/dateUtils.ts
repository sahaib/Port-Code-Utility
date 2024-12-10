export const parseUnlocodeDateFormat = (dateString: string): string => {
  if (!dateString || dateString.length !== 4) {
    return 'Date not available';
  }

  try {
    const year = parseInt(dateString.substring(0, 2));
    const month = parseInt(dateString.substring(2));
    
    // Convert 2-digit year to full year
    const fullYear = year >= 50 ? 1900 + year : 2000 + year;
    
    // Create date object and format
    const date = new Date(fullYear, month - 1);
    
    // Format as Month Year
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

// Helper function to format the last update date
export const formatLastUpdateDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};