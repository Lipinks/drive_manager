const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Replace with your client secret (for server-side) or leave empty for SPA

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET, // Remove if using implicit flow
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    window.location.href = '/login'; // Redirect to login
    throw error;
  }
};

// Wrapper to execute API calls with auto-refresh
export const withTokenRefresh = async (apiCall) => {
  try {
    return await apiCall(getAccessToken());
  } catch (error) {
    // Check if it's a 401 unauthorized error
    if (error.message?.includes('401') || error.status === 401) {
      const newToken = await refreshAccessToken();
      return await apiCall(newToken);
    }
    throw error;
  }
};
