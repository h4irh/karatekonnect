// Data storage and retrieval for KarateKonnect
class DataStorage {
  constructor() {
    this.cacheKey = 'karatekonnect_cache';
    this.tokenKey = 'karatekonnect_token';
  }

  // Get cached data
  getCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const age = Date.now() - data.timestamp;
      
      if (age > CONFIG.CACHE_DURATION) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      
      return data.content;
    } catch (e) {
      console.error('Cache read error:', e);
      return null;
    }
  }

  // Set cache
  setCache(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        content: data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }

  // Get GitHub token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set GitHub token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Clear token
  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Fetch data from Gist
  async fetchData() {
    // Try cache first
    const cached = this.getCache();
    if (cached) {
      console.log('Using cached data');
      return cached;
    }

    console.log('Fetching from Gist...');
    
    try {
      const response = await fetch(
        `${CONFIG.API_BASE}/gists/${CONFIG.GIST_ID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const gist = await response.json();
      const content = gist.files[CONFIG.GIST_FILENAME].content;
      const data = JSON.parse(content);
      
      // Cache the data
      this.setCache(data);
      
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      
      // Try to return cached data even if expired
      const oldCache = localStorage.getItem(this.cacheKey);
      if (oldCache) {
        console.log('Using expired cache as fallback');
        return JSON.parse(oldCache).content;
      }
      
      throw new Error('Failed to load data: ' + error.message);
    }
  }

  // Update data in Gist (requires token)
  async updateData(data) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('GitHub token required. Please configure in settings.');
    }

    try {
      data.lastUpdated = new Date().toISOString();
      
      const response = await fetch(
        `${CONFIG.API_BASE}/gists/${CONFIG.GIST_ID}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: {
              [CONFIG.GIST_FILENAME]: {
                content: JSON.stringify(data, null, 2)
              }
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Update cache
      this.setCache(data);
      
      return data;
    } catch (error) {
      console.error('Update error:', error);
      throw new Error('Failed to save data: ' + error.message);
    }
  }

  // Get single athlete by ID
  async getAthlete(athleteId) {
    const data = await this.fetchData();
    return data.athletes.find(a => a.id === athleteId);
  }

  // Get all athletes
  async getAllAthletes() {
    const data = await this.fetchData();
    return data.athletes;
  }

  // Update athlete data
  async updateAthlete(athleteId, updates) {
    const data = await this.fetchData();
    const index = data.athletes.findIndex(a => a.id === athleteId);
    
    if (index === -1) {
      throw new Error('Athlete not found');
    }

    // Merge updates
    data.athletes[index] = {
      ...data.athletes[index],
      ...updates
    };

    return await this.updateData(data);
  }
}

// Create global instance
const storage = new DataStorage();
