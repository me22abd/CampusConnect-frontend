import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { likeService, ReceivedLike } from '../services/like.service';
import { ReceivedLikeCard } from '../components/ReceivedLikeCard';
import { MatchModal } from '../components/MatchModal';
import { Match } from '../types';
import { colors } from '../theme/colors';

/**
 * Likes Screen
 * 
 * Frontend Integration:
 * - Fetches received likes from GET /api/likes/received
 * - Displays users who have liked the current user
 * - Allows "Like Back" to create matches
 * - Shows match modal when match is created
 */
export const LikesScreen: React.FC = () => {
  const [likes, setLikes] = useState<ReceivedLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likingUserId, setLikingUserId] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Fetch received likes on mount
  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      setLoading(true);
      const receivedLikes = await likeService.getReceivedLikes();
      setLikes(receivedLikes);
    } catch (error: any) {
      console.error('Error loading likes:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to load likes. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLikes();
  };

  const handleLikeBack = async (userId: string) => {
    if (likingUserId) return; // Prevent multiple simultaneous likes

    try {
      setLikingUserId(userId);
      const response = await likeService.likeUser(userId);

      // Check if match was created
      if (response.match) {
        setMatch(response.match);
        setShowMatchModal(true);
      }

      // Remove the user from the list (they're now matched or already liked)
      setLikes((prevLikes) => prevLikes.filter((like) => like.id !== userId));

      // Show success message if no match (already liked them back)
      if (!response.match) {
        Alert.alert('Success', 'You liked them back!');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'Failed to like user. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLikingUserId(null);
    }
  };

  const handleCloseMatchModal = () => {
    setShowMatchModal(false);
    setMatch(null);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading likes...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (likes.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.centerContent}>
            <Text style={styles.emptyTitle}>No likes yet</Text>
            <Text style={styles.emptySubtitle}>
              Keep swiping to get more likes!
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {likes.map((like) => (
          <ReceivedLikeCard
            key={like.id}
            user={like}
            onLikeBack={() => handleLikeBack(like.id)}
            liking={likingUserId === like.id}
          />
        ))}
      </ScrollView>

      <MatchModal
        visible={showMatchModal}
        match={match}
        onClose={handleCloseMatchModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
