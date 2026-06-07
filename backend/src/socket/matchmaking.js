import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MatchHistory from '../models/MatchHistory.js';
import { calculateCompatibilityScore, normalizeMatchProfile } from '../services/matchmakingService.js';
import { createCallSession } from '../services/callService.js';

class MatchmakingQueue {
  constructor(io) {
    this.io = io;
    this.queue = [];
    this.socketToUserId = new Map();
    this.isProcessingQueue = false;
  }

  static parseCookies(cookieHeader = '') {
    return cookieHeader.split(';').reduce((accumulator, part) => {
      const [rawKey, ...rawValue] = part.trim().split('=');

      if (!rawKey) {
        return accumulator;
      }

      accumulator[rawKey] = decodeURIComponent(rawValue.join('='));
      return accumulator;
    }, {});
  }

  static createProfileSnapshot(user) {
    return {
      ...normalizeMatchProfile({
        id: user._id.toString(),
        interests: user.interests,
        networkingGoals: user.networkingGoals,
        experienceLevel: user.experienceLevel,
        profession: user.profession,
        company: user.company
      }),
      fullName: user.fullName,
      profileImage: user.profileImage || '',
      userId: user._id.toString()
    };
  }

  static isEligibleUser(user) {
    if (!user) {
      return false;
    }

    const hasProfileData = Boolean(
      String(user.fullName || '').trim() &&
      (
        (Array.isArray(user.interests) && user.interests.length > 0) ||
        (Array.isArray(user.networkingGoals) && user.networkingGoals.length > 0) ||
        String(user.profession || '').trim() ||
        String(user.company || '').trim()
      )
    );

    const hasTrustSignal = Boolean(user.isVerified || (typeof user.reputationScore === 'number' && user.reputationScore >= 20));
    return hasProfileData && hasTrustSignal;
  }

  static isQualifyingCandidate(entry) {
    return (
      entry &&
      !entry.isMatching &&
      Boolean(entry.profile?.fullName) &&
      Boolean(entry.profile?.interests?.length || entry.profile?.networkingGoals?.length || entry.profile?.profession || entry.profile?.company) &&
      Boolean(entry.isVerified || (typeof entry.reputationScore === 'number' && entry.reputationScore >= 20))
    );
  }

  findBestCandidateFor(currentEntry) {
    const candidates = this.queue
      .filter((entry) => entry.userId !== currentEntry.userId)
      .filter(MatchmakingQueue.isQualifyingCandidate);

    if (!candidates.length) {
      return null;
    }

    const scoredCandidates = candidates.map((candidate) => ({
      entry: candidate,
      score: calculateCompatibilityScore(currentEntry.profile, candidate.profile)
    }));

    scoredCandidates.sort((a, b) => b.score - a.score);
    return scoredCandidates[0]?.entry || null;
  }

  logQueueState(context) {
    const queueSnapshot = this.queue.map((entry) => ({
      userId: entry.userId,
      socketId: entry.socketId,
      preferences: entry.preferences,
      joinedAt: entry.joinedAt,
      isMatching: entry.isMatching
    }));

    console.log(`[matchmaking] ${context}`);
    console.log('[matchmaking] queue contents:', JSON.stringify(queueSnapshot, null, 2));
  }

  logError(context, error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    console.error(`[matchmaking] ${context}: ${message}`);
    if (stack) {
      console.error(stack);
    }
  }

  emitToUser(socketId, eventName, payload) {
    console.log(`[matchmaking] emitting ${eventName} to socket ${socketId}:`, JSON.stringify(payload, null, 2));
    this.io.to(socketId).emit(eventName, payload);
  }

  emitMatchmakingError(entry, message, details = {}) {
    const payload = {
      message,
      ...details
    };

    this.emitToUser(entry.socketId, 'matchmaking:error', payload);
  }

  clearMatchingState(entries, reason = 'cleanup') {
    for (const entry of entries) {
      if (!entry) {
        continue;
      }

      entry.isMatching = false;
      this.removeQueueEntry(entry.userId);
      console.log(`[matchmaking] queue cleanup for userId=${entry.userId} socketId=${entry.socketId} reason=${reason}`);
    }

    this.logQueueState(`after ${reason}`);
  }

  removeQueueEntry(userId) {
    const index = this.queue.findIndex((entry) => entry.userId === userId);

    if (index === -1) {
      return null;
    }

    const [removedEntry] = this.queue.splice(index, 1);
    return removedEntry;
  }

  removeBySocket(socketId) {
    const entry = this.queue.find((queueEntry) => queueEntry.socketId === socketId);

    if (!entry) {
      return null;
    }

    return this.removeQueueEntry(entry.userId);
  }

  async authenticateSocket(socket) {
    const tokenFromAuth = socket.handshake.auth?.token;
    const tokenFromCookie = MatchmakingQueue.parseCookies(socket.handshake.headers.cookie).token;
    const token = tokenFromAuth || tokenFromCookie;

    if (!token) {
      socket.emit('matchmaking:error', { message: 'Authentication token missing' });
      socket.disconnect(true);
      return null;
    }

    if (!process.env.JWT_SECRET) {
      socket.emit('matchmaking:error', { message: 'JWT secret is not configured' });
      socket.disconnect(true);
      return null;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('fullName profileImage interests networkingGoals experienceLevel profession company');

      if (!user) {
        socket.emit('matchmaking:error', { message: 'User not found' });
        socket.disconnect(true);
        return null;
      }

      socket.data.user = user;
      socket.join(`user:${user._id.toString()}`);
      this.socketToUserId.set(socket.id, user._id.toString());
      console.log(`[matchmaking] socket authenticated userId=${user._id.toString()} socketId=${socket.id}`);
      return user;
    } catch (error) {
      socket.emit('matchmaking:error', { message: 'Invalid or expired authentication token' });
      socket.disconnect(true);
      return null;
    }
  }

  removeUser(userId) {
    const entry = this.removeQueueEntry(userId);

    if (!entry) {
      return false;
    }

    console.log(`[matchmaking] removed userId=${userId} from queue`);
    this.logQueueState(`after removing userId=${userId}`);
    return true;
  }

  async hasExistingMatch(userA, userB) {
    const existing = await MatchHistory.findOne({
      sessionType: 'chat',
      $or: [
        { user1: userA, user2: userB },
        { user1: userB, user2: userA }
      ]
    }).select('_id');

    return Boolean(existing);
  }

  async tryMatchQueuedUsers() {
    if (this.isProcessingQueue) {
      console.log('[matchmaking] matchmaking already in progress, skipping nested run');
      return;
    }

    this.isProcessingQueue = true;
    console.log(`[matchmaking] matchmaking attempt with queue size=${this.queue.length}`);

    try {
      while (this.queue.length >= 2) {
        let currentEntry = null;
        let candidateEntry = null;

        for (const entry of this.queue) {
          if (entry.isMatching || !MatchmakingQueue.isQualifyingCandidate(entry)) {
            continue;
          }

          const bestCandidate = this.findBestCandidateFor(entry);
          if (bestCandidate) {
            currentEntry = entry;
            candidateEntry = bestCandidate;
            break;
          }
        }

        if (!currentEntry || !candidateEntry) {
          console.log('[matchmaking] no viable match candidates available after filtering');
          break;
        }

        if (currentEntry.userId === candidateEntry.userId) {
          console.log('[matchmaking] skipping self-match candidate', currentEntry.userId);
          this.queue.splice(0, 1);
          continue;
        }

        if (currentEntry.isMatching || candidateEntry.isMatching) {
          console.log('[matchmaking] one of the entries is already matching, skipping');
          return;
        }

        currentEntry.isMatching = true;
        candidateEntry.isMatching = true;

        console.log(
          `[matchmaking] matchmaking started userId=${currentEntry.userId} socketId=${currentEntry.socketId} <-> userId=${candidateEntry.userId} socketId=${candidateEntry.socketId}`
        );

        try {
          const callType = 'video';
          console.log(
            `[matchmaking] createCallSession called hostUserId=${currentEntry.userId} participantUserId=${candidateEntry.userId} sessionType=${callType}`
          );

          const roomSession = await createCallSession({
            hostUserId: currentEntry.userId,
            participantUserId: candidateEntry.userId,
            sessionType: callType
          });

          if (!roomSession?.sessionId) {
            throw new Error('createCallSession returned an invalid session payload');
          }

          console.log(
            `[matchmaking] Stream room/session creation success sessionId=${roomSession.sessionId} sessionType=${roomSession.sessionType || callType}`
          );
          console.log('[matchmaking] Stream response:', JSON.stringify({ sessionId: roomSession.sessionId, sessionType: roomSession.sessionType, status: roomSession.status }, null, 2));

          const matchHistory = await MatchHistory.create({
            user1: currentEntry.userId,
            user2: candidateEntry.userId,
            sessionType: callType,
            duration: 0
          });

          const payloadForCurrent = {
            matchId: matchHistory._id.toString(),
            sessionId: roomSession.sessionId,
            roomId: roomSession.sessionId,
            partner: {
              userId: candidateEntry.userId,
              name: candidateEntry.profile.fullName || 'Matched user',
              fullName: candidateEntry.profile.fullName || 'Matched user',
              profileImage: candidateEntry.profileImage || '',
              profession: candidateEntry.profile.profession || '',
              company: candidateEntry.profile.company || '',
              preferences: candidateEntry.preferences
            },
            matchedAt: matchHistory.createdAt
          };

          const payloadForCandidate = {
            matchId: matchHistory._id.toString(),
            sessionId: roomSession.sessionId,
            roomId: roomSession.sessionId,
            partner: {
              userId: currentEntry.userId,
              name: currentEntry.profile.fullName || 'Matched user',
              fullName: currentEntry.profile.fullName || 'Matched user',
              profileImage: currentEntry.profileImage || '',
              profession: currentEntry.profile.profession || '',
              company: currentEntry.profile.company || '',
              preferences: currentEntry.preferences
            },
            matchedAt: matchHistory.createdAt
          };

          console.log(
            `[matchmaking] successful match userId=${currentEntry.userId} socketId=${currentEntry.socketId} <-> userId=${candidateEntry.userId} socketId=${candidateEntry.socketId}`
          );
          console.log(`[matchmaking] shared video room sessionId=${roomSession.sessionId}`);

          this.emitToUser(currentEntry.socketId, 'match-found', payloadForCurrent);
          this.emitToUser(candidateEntry.socketId, 'match-found', payloadForCandidate);
          this.emitToUser(currentEntry.socketId, 'matchmaking:matched', payloadForCurrent);
          this.emitToUser(candidateEntry.socketId, 'matchmaking:matched', payloadForCandidate);

          this.removeQueueEntry(currentEntry.userId);
          this.removeQueueEntry(candidateEntry.userId);
          console.log(
            `[matchmaking] queue cleanup after match userId=${currentEntry.userId}, userId=${candidateEntry.userId}`
          );
          this.logQueueState('after successful match');
        } catch (matchError) {
          this.logError(
            `matchmaking failure for userId=${currentEntry.userId} socketId=${currentEntry.socketId} and userId=${candidateEntry.userId} socketId=${candidateEntry.socketId}`,
            matchError
          );

          this.emitMatchmakingError(currentEntry, 'Unable to create the shared video room', {
            reason: 'room_creation_failed'
          });
          this.emitMatchmakingError(candidateEntry, 'Unable to create the shared video room', {
            reason: 'room_creation_failed'
          });

          this.clearMatchingState([currentEntry, candidateEntry], 'room creation failure');
        }
      }
    } catch (error) {
      this.logError('unhandled matchmaking loop failure', error);
    } finally {
      this.isProcessingQueue = false;

      if (this.queue.length >= 2) {
        console.log('[matchmaking] queue still has enough users after processing, scheduling another matchmaking pass');
        setImmediate(() => {
          void this.tryMatchQueuedUsers();
        });
      }
    }
  }

  async joinQueue(socket) {
    const currentUser = socket.data.user;
    if (!currentUser) {
      socket.emit('matchmaking:error', { message: 'User is not authenticated' });
      return;
    }

    const userId = currentUser._id.toString();
    if (this.queue.some((entry) => entry.userId === userId)) {
      console.log(`[matchmaking] duplicate queue join ignored for userId=${userId}`);
      socket.emit('matchmaking:queued', { message: 'You are already in the matchmaking queue' });
      return;
    }

    const freshUser = await User.findById(currentUser._id).select('fullName profileImage interests networkingGoals experienceLevel profession company isVerified reputationScore');

    if (!freshUser) {
      socket.emit('matchmaking:error', { message: 'User profile not found' });
      return;
    }

    if (!MatchmakingQueue.isEligibleUser(freshUser)) {
      socket.emit('matchmaking:error', {
        message:
          'Your account must be verified and have completed profile details before connecting with real professionals. Please verify your account and update your interests, goals, or experience.'
      });
      return;
    }

    const profile = MatchmakingQueue.createProfileSnapshot(freshUser);
    const preferences = {
      interests: profile.interests,
      goals: profile.networkingGoals,
      experienceLevel: profile.experienceLevel,
      profession: profile.profession,
      company: profile.company
    };

    const entry = {
      userId,
      socketId: socket.id,
      profile,
      preferences,
      profileImage: freshUser.profileImage || '',
      isVerified: Boolean(freshUser.isVerified),
      reputationScore: freshUser.reputationScore || 0,
      joinedAt: new Date().toISOString(),
      isMatching: false
    };

    this.queue.push(entry);
    console.log(
      `[matchmaking] user joined queue userId=${userId} socketId=${socket.id} provider=${currentUser.authProvider || 'unknown'}`
    );
    this.logQueueState(`after join userId=${userId}`);

    socket.emit('matchmaking:queued', {
      message: 'You joined the matchmaking queue',
      queueSize: this.queue.length
    });

    void this.tryMatchQueuedUsers();
  }

  leaveQueue(socket) {
    const userId = this.socketToUserId.get(socket.id) || socket.data.user?._id?.toString();

    if (!userId) {
      socket.emit('matchmaking:left', { message: 'Not currently in queue' });
      return;
    }

    const removed = this.removeUser(userId);
    if (removed) {
      socket.emit('matchmaking:left', { message: 'You left the matchmaking queue' });
    } else {
      socket.emit('matchmaking:left', { message: 'Not currently in queue' });
    }
  }

  handleDisconnect(socket) {
    const userId = this.socketToUserId.get(socket.id) || socket.data.user?._id?.toString();

    if (userId) {
      console.log(`[matchmaking] socket disconnected socketId=${socket.id} userId=${userId}`);
      this.removeUser(userId);
      this.socketToUserId.delete(socket.id);
    }
  }
}

export function initializeMatchmaking(io) {
  const matchmakingQueue = new MatchmakingQueue(io);

  io.on('connection', (socket) => {
    console.log(`[matchmaking] socket connected socketId=${socket.id}`);

    const authPromise = matchmakingQueue.authenticateSocket(socket);

    socket.on('matchmaking:join', async () => {
      const user = socket.data.user || (await authPromise.catch(() => null));

      if (!user) {
        console.log(`[matchmaking] join ignored because authentication failed socketId=${socket.id}`);
        return;
      }

      await matchmakingQueue.joinQueue(socket);
    });

    socket.on('matchmaking:leave', () => {
      matchmakingQueue.leaveQueue(socket);
    });

    socket.on('disconnect', () => {
      matchmakingQueue.handleDisconnect(socket);
    });
  });

  return matchmakingQueue;
}