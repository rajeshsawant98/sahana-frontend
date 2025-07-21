export type PopularCategory = {
  label: string;
  emoji?: string;
  interests: string[];
};

export const popularCategories: PopularCategory[] = [
  {
    label: "Popular",
    emoji: "🔥",
    interests: [
      "Live Music", "Dance Parties", "Comedy Shows", "Networking Events", "Food Festivals",
      "Wellness Gatherings", "Latin Nights", "Art Shows", "Baseball Games", "Storytelling"
    ]
  },
  {
    label: "Music & Nightlife",
    emoji: "🎶",
    interests: [
      "Live Music", "EDM", "Reggaeton", "Hip-Hop", "Rock", "Techno", "Jazz", "Latin Nights"
    ]
  },
  {
    label: "Food & Drink",
    emoji: "🍔",
    interests: [
      "Food Festivals", "Brunch Events", "Whiskey Tastings", "Seafood Competitions", "Beer & Spirits"
    ]
  },
  {
    label: "Arts & Culture",
    emoji: "🎭",
    interests: [
      "Comedy Shows", "Theatre", "Fine Arts", "Dance Performances", "Literary Readings"
    ]
  },
  {
    label: "Community & Education",
    emoji: "🌍",
    interests: [
      "Health Seminars", "Business Conferences", "Family Events", "Networking Events", "Cultural Festivals"
    ]
  },
  {
    label: "Sports & Outdoors",
    emoji: "🏟️",
    interests: [
      "Baseball Games", "Golf Events", "Fitness Classes", "Outdoor Adventures"
    ]
  },
  {
    label: "Wellness",
    emoji: "🧘",
    interests: [
      "Yoga", "Meditation", "Wellness Retreats", "Health & Fitness", "Pilates"
    ]
  }
];