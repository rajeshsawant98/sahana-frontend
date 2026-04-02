
export interface Location {
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string | null;
  name: string | null;
}

export interface SemanticUserResult {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  profession: string | null;
  profile_picture: string | null;
  location: Location | null;
  interests: string[];
  vibe_description: string | null;
  similarity_score: number;
  friendship_status: 'none';
}

export interface FriendProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  location?: Record<string, any>;
  interests?: string[];
  created_at?: string;
}

export interface RecommendedUser {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profession?: string;
  profile_picture?: string;
  location?: Record<string, any>;
  interests?: string[];
  vibe_description?: string | null;
  score: number;
  reasons?: { similarityScore: number };
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  location?: Record<string, any>;
  interests?: string[];
  friendship_status?: 'none' | 'friends' | 'pending_sent' | 'pending_received';
}

export interface FriendRequest {
  id: string;
  sender: FriendProfile;
  receiver: FriendProfile;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface FriendRequestsResponse {
  received: FriendRequest[];
  sent: FriendRequest[];
}

export interface SendFriendRequestPayload {
  receiver_id: string;
}

export interface FriendshipStatusResponse {
  friendship_status: 'none' | 'friends' | 'pending_sent' | 'pending_received';
}

// UI State Types
export interface FriendsUIState {
  searchTerm: string;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  selectedTab: 'friends' | 'requests' | 'search' | 'recommended';
  searchMode: 'regular' | 'semantic';
}

export interface FriendRequestsUIState {
  activeTab: 'received' | 'sent';
  isLoading: boolean;
  errors: Record<string, string>;
}

// Cache-related types
export interface FriendsApiParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface FriendRequestsApiParams {
  type?: 'received' | 'sent';
}
