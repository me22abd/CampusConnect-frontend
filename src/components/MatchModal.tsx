import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Match } from '../types';
import { colors } from '../theme/colors';
import { Button } from './Button';

interface MatchModalProps {
  visible: boolean;
  match: Match | null;
  onClose: () => void;
}

/**
 * Match Modal Component
 * Displays when a match is created
 */
export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  match,
  onClose,
}) => {
  if (!match) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>It's a Match! 🎉</Text>
          <Text style={styles.subtitle}>You and {match.user.name} liked each other</Text>

          {match.user.profileImageUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: match.user.profileImageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{match.user.name}</Text>
            {match.user.age && (
              <Text style={styles.matchAge}>, {match.user.age}</Text>
            )}
          </View>

          <Button title="Keep Swiping" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  matchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  matchAge: {
    fontSize: 24,
    color: colors.textSecondary,
  },
});

