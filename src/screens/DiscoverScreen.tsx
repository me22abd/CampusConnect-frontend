import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/user.service';
import { likeService } from '../services/like.service';
import { UserCard } from '../components/UserCard';
import { MatchModal } from '../components/MatchModal';
import { Button } from '../components/Button';
import { User, Match } from '../types';
import { colors } from '../theme/colors';

/**
 * Discover Screen
 * 
 * Frontend Integration:
 * - Fetches discoverable users (GET /api/users/discover - to be implemented)
 * - Allows users to like or pass on other users
 * - Calls POST /api/likes/:userId when user likes someone
 * - Shows match modal when a match is created
 */
export const DiscoverScreen: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Fetch discoverable users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const discoverableUsers = await userService.getDiscoverableUsers();
      
      // Filter out current user (safety check)
      const filteredUsers = discoverableUsers.filter(
        (u) => u.id !== currentUser?.id
      );
      
      setUsers(filteredUsers);
      setCurrentIndex(0);
    } catch (error: any) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const currentUserCard = users[currentIndex];
    if (!currentUserCard || liking) return;

    try {
      setLiking(true);
      const response = await likeService.likeUser(currentUserCard.id);

      // Check if match was created
      if (response.match) {
        setMatch(response.match);
        setShowMatchModal(true);
      }

      // Move to next user
      moveToNext();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'Failed to like user. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLiking(false);
    }
  };

  const handlePass = () => {
    // Simply move to next user (no API call needed for pass)
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more users, reload
      loadUsers();
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
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>No users found</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for more profiles to discover
          </Text>
          <Button
            title="Refresh"
            onPress={loadUsers}
            variant="secondary"
            style={{ marginTop: 24 }}
          />
        </View>
      </View>
    );
  }

  // No more users in current batch
  if (currentIndex >= users.length) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for more profiles
          </Text>
          <Button
            title="Refresh"
            onPress={loadUsers}
            variant="secondary"
            style={{ marginTop: 24 }}
          />
        </View>
      </View>
    );
  }

  const currentUserCard = users[currentIndex];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserCard user={currentUserCard} />

        <View style={styles.actions}>
          <Button
            title="Pass"
            onPress={handlePass}
            variant="secondary"
            disabled={liking}
            style={styles.passButton}
          />
          <Button
            title="Like"
            onPress={handleLike}
            loading={liking}
            disabled={liking}
            style={styles.likeButton}
          />
        </View>
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  passButton: {
    flex: 1,
  },
  likeButton: {
    flex: 1,
  },
});
