import * as driveService from './driveService';

const FILES = {
  STAR: 'star.json',
  FAVORITES: 'favorites.json',
  TAGS: 'tags.json'
};

const validateData = (data, type = 'array') => {
  if (type === 'array') {
    return Array.isArray(data) ? data : [];
  }
  return typeof data === 'object' && data !== null ? data : {};
};

export const saveStarFile = async (accessToken) => {
  try {
    // Get raw stars array from localStorage
    const stars = JSON.parse(localStorage.getItem('stars') || '[]');
    
    // Ensure it's a plain array, not a nested object
    const starsArray = Array.isArray(stars) ? stars : 
                      (stars?.stars ? stars.stars : []);
    
    // Save only the stars array to drive
    const favoritesRaw = JSON.parse(localStorage.getItem('favorites') || '{}');
    const tagsRaw = JSON.parse(localStorage.getItem('tags') || '[]');

    await saveFile(accessToken, FILES.STAR, starsArray);
    console.log('Saved stars:', starsArray);
    await saveFile(accessToken, FILES.FAVORITES, JSON.parse(localStorage.getItem('favorites')));
    console.log('Saved favorites:', JSON.parse(localStorage.getItem('favorites')));
    await saveFile(accessToken, FILES.TAGS, JSON.parse(localStorage.getItem('tags')));
    console.log('Saved tags:', JSON.parse(localStorage.getItem('tags')));
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
};

const saveFile = async (accessToken, fileName, data) => {
  try {
    // Create blob with proper formatting
    const fileContent = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });

    const files = await driveService.listFiles(accessToken);
    const existingFile = files.find(file => file.name === fileName);
    
    if (existingFile) {
      // Update existing file
      const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: fileContent,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to update ${fileName}: ${res.status} ${res.statusText} ${text}`);
      }
      return await res.json().catch(() => null);
    } else {
      // Create new file
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', fileContent);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to create ${fileName}: ${res.status} ${res.statusText} ${text}`);
      }
      return await res.json().catch(() => null);
    }
  } catch (error) {
    console.error(`Error saving ${fileName}:`, error);
    throw error;
  }
};

const fetchFile = async (accessToken, fileName) => {
  try {
    const files = await driveService.listFiles(accessToken);
    const file = files.find(f => f.name === fileName);
    
    if (!file) return null;

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${fileName}:`, error);
    return null;
  }
};

export const fetchStarFile = async (accessToken) => {
  try {
    const [starsData, favoritesData, tagsData] = await Promise.all([
      fetchFile(accessToken, FILES.STAR),
      fetchFile(accessToken, FILES.FAVORITES),
      fetchFile(accessToken, FILES.TAGS)
    ]);

    // Ensure consistent array format for stars
    const stars = Array.isArray(starsData) ? starsData : 
                 starsData?.stars ? starsData.stars : [];

    // Store normalized data in localStorage
    localStorage.setItem('stars', JSON.stringify(stars));
    localStorage.setItem('favorites', JSON.stringify(favoritesData || {}));
    localStorage.setItem('tags', JSON.stringify(tagsData || []));

    return stars;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const editStar = async (starId, updatedData) => {
  try {
    const stars = JSON.parse(localStorage.getItem('stars') || '[]');
    const starsArray = Array.isArray(stars) ? stars : (stars?.stars ? stars.stars : []);
    
    const updatedStars = starsArray.map(star => 
      star.id === starId ? { ...star, ...updatedData } : star
    );
    
    localStorage.setItem('stars', JSON.stringify(updatedStars));
    return updatedStars;
  } catch (error) {
    console.error('Edit star error:', error);
    throw error;
  }
};

export const syncWithDrive = async (accessToken) => {
  try {
    if (!accessToken) throw new Error('Missing access token');

    // safe parse with defaults
    const starsRaw = JSON.parse(localStorage.getItem('stars') || '[]');
    const favoritesRaw = JSON.parse(localStorage.getItem('favorites') || '{}');
    const tagsRaw = JSON.parse(localStorage.getItem('tags') || '[]');

    const stars = validateData(starsRaw, 'array');
    const favorites = validateData(favoritesRaw, 'object');
    const tags = validateData(tagsRaw, 'array');

    // upload in parallel (order doesn't matter)
    const results = await Promise.all([
      saveFile(accessToken, FILES.STAR, stars),
      saveFile(accessToken, FILES.FAVORITES, favorites),
      saveFile(accessToken, FILES.TAGS, tags)
    ]);
    console.log('syncWithDrive results:', {
      star: !!results[0],
      favorites: !!results[1],
      tags: !!results[2]
    });
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};