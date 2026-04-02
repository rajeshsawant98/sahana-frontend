import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, AutoAwesome, PersonAdd, LocationOn } from '@mui/icons-material';
import { useFriends } from '../../hooks/useFriends';
import { UserSearchResult, SemanticUserResult } from '../../types/friends';

const interestChipSx = {
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '0.7rem',
  height: 22,
  backgroundColor: 'rgba(255, 191, 73, 0.12)',
  color: '#FFBF49',
  border: '1px solid rgba(255, 191, 73, 0.2)',
} as const;

const AddFriendButton: React.FC<{ userId: string; disabled: boolean; onClick: (id: string) => void }> = ({
  userId,
  disabled,
  onClick,
}) => (
  <Button
    variant="contained"
    startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
    onClick={() => onClick(userId)}
    disabled={disabled}
    sx={{ borderRadius: '100px', px: 2, height: 32, fontSize: '0.75rem', textTransform: 'none' }}
  >
    Add Friend
  </Button>
);

const InterestChips: React.FC<{ interests: string[] }> = ({ interests }) => {
  if (interests.length === 0) return null;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
      {interests.slice(0, 3).map((interest) => (
        <Chip key={interest} label={interest} size="small" sx={interestChipSx} />
      ))}
      {interests.length > 3 && (
        <Chip
          label={`+${interests.length - 3}`}
          size="small"
          sx={{
            ...interestChipSx,
            backgroundColor: 'transparent',
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        />
      )}
    </Box>
  );
};

export const FriendSearch: React.FC = () => {
  const {
    ui,
    searchResults,
    semanticResults,
    loading,
    errors,
    handleSearchTermChange,
    handleSearchModeChange,
    handleSendFriendRequest,
  } = useFriends();

  const isSemanticMode = ui.searchMode === 'semantic';

  const handleSendRequest = async (userId: string) => {
    const result = await handleSendFriendRequest(userId);
    if (!result.success) {
      console.error('Failed to send friend request:', result.error);
    }
  };

  const getStatusButton = (user: UserSearchResult) => {
    const baseSx = { borderRadius: '100px', px: 2, height: 32, fontSize: '0.75rem', textTransform: 'none' as const };
    switch (user.friendship_status) {
      case 'friends':
        return (
          <Button variant="outlined" disabled color="success" sx={baseSx}>
            Friends
          </Button>
        );
      case 'pending_sent':
        return (
          <Button variant="outlined" disabled color="warning" sx={baseSx}>
            Sent
          </Button>
        );
      case 'pending_received':
        return (
          <Button variant="outlined" disabled color="info" sx={baseSx}>
            Received
          </Button>
        );
      case 'none':
      default:
        return (
          <AddFriendButton userId={user.id} disabled={loading.sendRequest} onClick={handleSendRequest} />
        );
    }
  };

  const isSearching = isSemanticMode ? loading.semanticSearch : loading.search;
  const searchError = isSemanticMode ? errors.semanticSearch : errors.search;
  const activeResults = isSemanticMode ? semanticResults : searchResults;
  const hasQuery = ui.searchTerm.trim().length > 0;

  return (
    <Box>
      {/* Mode Toggle */}
      <Box
        sx={{
          display: 'inline-flex',
          gap: 0.5,
          p: 0.5,
          borderRadius: '10px',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          mb: 2,
        }}
      >
        {([
          { mode: 'regular' as const, label: 'By name / email', icon: <SearchIcon sx={{ fontSize: 14 }} /> },
          { mode: 'semantic' as const, label: 'AI search', icon: <AutoAwesome sx={{ fontSize: 14 }} /> },
        ] as const).map(({ mode, label, icon }) => (
          <Box
            key={mode}
            onClick={() => handleSearchModeChange(mode)}
            sx={{
              px: 1.75,
              py: 0.6,
              borderRadius: '7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.825rem',
              fontWeight: ui.searchMode === mode ? 600 : 500,
              color: ui.searchMode === mode ? '#000' : 'text.secondary',
              backgroundColor: ui.searchMode === mode
                ? mode === 'semantic' ? '#A29BFE' : '#FFBF49'
                : 'transparent',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            {icon}
            {label}
          </Box>
        ))}
      </Box>

      {/* Search input */}
      <TextField
        fullWidth
        placeholder={
          isSemanticMode
            ? 'Describe the kind of person you want to meet…'
            : 'Search users by name or email…'
        }
        value={ui.searchTerm}
        onChange={(e) => handleSearchTermChange(e.target.value)}
        multiline={isSemanticMode}
        maxRows={3}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isSemanticMode ? (
                <AutoAwesome sx={{ color: '#A29BFE' }} />
              ) : (
                <SearchIcon sx={{ color: 'text.disabled' }} />
              )}
            </InputAdornment>
          ),
          endAdornment: isSearching && (
            <InputAdornment position="end">
              <CircularProgress size={18} sx={{ color: isSemanticMode ? '#A29BFE' : '#FFBF49' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            ...(isSemanticMode && {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#A29BFE',
              },
            }),
          },
        }}
      />

      {searchError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
          {searchError}
        </Alert>
      )}

      {errors.sendRequest && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
          {errors.sendRequest}
        </Alert>
      )}

      {/* Semantic results */}
      {isSemanticMode && (
        <Stack spacing={1.5}>
          {(semanticResults as SemanticUserResult[]).map((user) => (
            <Box
              key={user.id}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2.5,
                transition: 'border-color 0.15s ease',
                '&:hover': { borderColor: 'rgba(162, 155, 254, 0.4)' },
              }}
            >
              <Avatar
                src={user.profile_picture ?? undefined}
                alt={user.name}
                sx={{
                  width: 48,
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  backgroundColor: '#A29BFE',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>

              <Box flex={1} sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                    {user.name}
                  </Typography>
                  <Chip
                    label={`${Math.round(user.similarity_score * 100)}% match`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(162, 155, 254, 0.15)',
                      color: '#A29BFE',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      height: 20,
                      borderRadius: '100px',
                    }}
                  />
                </Box>

                {user.profession && (
                  <Typography variant="caption" color="text.secondary">
                    {user.profession}
                  </Typography>
                )}

                {(user.bio || user.vibe_description) && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.75,
                      lineHeight: 1.5,
                      fontSize: '0.8rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {user.bio || user.vibe_description}
                  </Typography>
                )}

                {user.location?.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">
                      {user.location.city}
                      {user.location.state ? `, ${user.location.state}` : ''}
                    </Typography>
                  </Box>
                )}

                <InterestChips interests={user.interests} />
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                <AddFriendButton userId={user.id} disabled={loading.sendRequest} onClick={handleSendRequest} />
              </Box>
            </Box>
          ))}

          {hasQuery && !isSearching && semanticResults.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: '14px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                No matches found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try describing different interests or hobbies.
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      {/* Regular results */}
      {!isSemanticMode && (
        <Stack spacing={1.5}>
          {(searchResults as UserSearchResult[]).map((user) => (
            <Box
              key={user.id}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2.5,
                transition: 'border-color 0.15s ease',
                '&:hover': { borderColor: 'rgba(162, 155, 254, 0.4)' },
              }}
            >
              <Avatar
                src={user.profile_picture}
                alt={user.name}
                sx={{
                  width: 48,
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  backgroundColor: '#A29BFE',
                  color: '#fff',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>

              <Box flex={1} sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {user.email}
                </Typography>

                {user.bio && (
                  <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.5, color: 'text.secondary' }}>
                    {user.bio}
                  </Typography>
                )}

                {user.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">
                      {(user.location as any).address ?? (user.location as any).formattedAddress}
                    </Typography>
                  </Box>
                )}

                <InterestChips interests={user.interests ?? []} />
              </Box>

              <Box sx={{ flexShrink: 0 }}>{getStatusButton(user)}</Box>
            </Box>
          ))}

          {hasQuery && !isSearching && searchResults.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: '14px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No results for "{ui.searchTerm}". Try a different name or email.
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};
