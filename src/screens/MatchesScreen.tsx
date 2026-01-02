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
import { useNavigation } from '@react-navigation/native';
import { matchService } from '../services/match.service';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { colors } from '../theme/colors';

/**
 * Matches Screen
 * 
 * Frontend Integration:
 * - Fetches matches from GET /api/matches
 * - Displays all matched users
 * - Navigates to Chat screen on card tap
 */
export const MatchesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch matches on mount
  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const userMatches = await matchService.getMatches();
      setMatches(userMatches);
    } catch (error: any) {
      console.error('Error loading matches:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to load matches. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const handleMatchPress = (match: Match) => {
    // Navigate to Chat screen with match user info
    navigation.navigate('Chat' as never, {
      userId: match.user.id,
      userName: match.user.name,
      matchId: match.id,
    } as never);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (matches.length === 0) {
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
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>
              Keep swiping to find your match!
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
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() => handleMatchPress(match)}
          />
        ))}
      </ScrollView>
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
