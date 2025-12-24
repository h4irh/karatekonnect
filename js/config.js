// Configuration for KarateKonnect
const CONFIG = {
  // Replace with your GitHub Gist ID
  GIST_ID: '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',
  GIST_FILENAME: 'karatekonnect-data.json',
  
  // GitHub API endpoint
  API_BASE: 'https://api.github.com',
  
  // Cache duration in milliseconds (5 minutes)
  CACHE_DURATION: 5 * 60 * 1000,
  
  // Default stats structure
  DEFAULT_STATS: {
    Strength: 50,
    Endurance: 50,
    Stamina: 50,
    Agility: 50,
    Speed: 50,
    Flexibility: 50,
    Intelligence: 50,
    Technique: 50
  },
  
  // Kata list for Shotokan
  KATA_LIST: [
    { id: 'heian_shodan', name: 'Heian Shodan' },
    { id: 'heian_nidan', name: 'Heian Nidan' },
    { id: 'heian_sandan', name: 'Heian Sandan' },
    { id: 'heian_yondan', name: 'Heian Yondan' },
    { id: 'heian_godan', name: 'Heian Godan' },
    { id: 'tekki_shodan', name: 'Tekki Shodan' }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
