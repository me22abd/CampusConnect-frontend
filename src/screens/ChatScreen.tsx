import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { messageService } from '../services/message.service';
import { Button } from '../components/Button';
import { Message } from '../types';
import { colors } from '../theme/colors';

/**
 * Chat Screen
 * 
 * Frontend Integration:
 * - Fetches messages from GET /api/messages/:matchId
 * - Sends messages via POST /api/messages/:matchId
 * - Auto-refreshes messages after sending
 */
export const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: currentUser } = useAuthStore();
  const { matchId, userName } = (route.params as any) || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    navigation.setOptions({
      title: userName || 'Chat',
      headerStyle: {
        backgroundColor: colors.surface,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, userName]);

  // Fetch messages on mount
  useEffect(() => {
    if (matchId) {
      loadMessages();
    }
  }, [matchId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      const fetchedMessages = await messageService.getMessages(matchId);
      setMessages(fetchedMessages);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to load messages. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!matchId || !messageText.trim() || sending) return;

    const content = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      // Send message
      await messageService.sendMessage(matchId, content);

      // Reload messages to get the latest
      await loadMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to send message. Please try again.';
      Alert.alert('Error', errorMessage);
      // Restore message text on error
      setMessageText(content);
    } finally {
      setSending(false);
    }
  };

  const isCurrentUserMessage = (message: Message) => {
    return message.senderId === currentUser?.id;
  };

  if (loading && messages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                isCurrentUserMessage(message)
                  ? styles.currentUserMessage
                  : styles.otherUserMessage,
              ]}
            >
              {!isCurrentUserMessage(message) && (
                <Text style={styles.senderName}>{message.senderName}</Text>
              )}
              <Text
                style={[
                  styles.messageText,
                  isCurrentUserMessage(message)
                    ? styles.currentUserText
                    : styles.otherUserText,
                ]}
              >
                {message.content}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  isCurrentUserMessage(message)
                    ? styles.currentUserTime
                    : styles.otherUserTime,
                ]}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textDisabled}
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <Button
          title="Send"
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
          loading={sending}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  messageBubble: {
    maxWidth: '75%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: colors.text,
  },
  otherUserText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  currentUserTime: {
    color: colors.text,
    opacity: 0.7,
  },
  otherUserTime: {
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  sendButton: {
    minWidth: 70,
    paddingHorizontal: 20,
  },
});
