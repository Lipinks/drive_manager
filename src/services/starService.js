import * as driveService from './driveService';

const STAR_FILE_NAME = 'star.json';

export const getStarFile = async (accessToken) => {
  try {
    const files = await driveService.listFiles(accessToken);
    const starFile = files.find(file => file.name === STAR_FILE_NAME);
    
    if (!starFile) {
      return [];
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${starFile.id}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching star file:', error);
    return [];
  }
};

export const saveStarFile = async (accessToken, stars) => {
  const files = await driveService.listFiles(accessToken);
  const starFile = files.find(file => file.name === STAR_FILE_NAME);
  const fileContent = new Blob([JSON.stringify(stars)], { type: 'application/json' });
  
  if (starFile) {
    // Update existing file
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${starFile.id}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: fileContent,
    });
  } else {
    // Create new file
    const metadata = {
      name: STAR_FILE_NAME,
      mimeType: 'application/json',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', fileContent);

    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
  }
};