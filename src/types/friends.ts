export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  interests?: string[];
  events_created?: number;
  events_attended?: number;
  created_at?: string;
}

export interface FriendProfile extends User {
  events_created: number;
  events_attended: number;
}

export interface UserSearchResult extends User {
  friendship_status: 'none' | 'friends' | 'pending_sent' | 'pending_received';
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
  selectedTab: 'friends' | 'requests' | 'search';
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
