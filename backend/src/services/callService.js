import { randomUUID } from 'node:crypto';
import CallSession from '../models/CallSession.js';
import User from '../models/User.js';

function normalizeSessionType(sessionType) {
  const normalizedSessionType = String(sessionType || 'video').toLowerCase();
  return ['audio', 'video'].includes(normalizedSessionType) ? normalizedSessionType : 'video';
}

export async function createCallSession({ hostUserId, participantUserId = null, sessionType = 'video' }) {
  const normalizedSessionType = normalizeSessionType(sessionType);

  console.log(
    '[callService] createCallSession called',
    JSON.stringify(
      {
        hostUserId: String(hostUserId || ''),
        participantUserId: participantUserId ? String(participantUserId) : null,
        sessionType: normalizedSessionType,
        hasStreamApiKey: Boolean(process.env.STREAM_API_KEY),
        hasStreamSecret: Boolean(process.env.STREAM_SECRET)
      },
      null,
      2
    )
  );

  const hostUser = await User.findById(hostUserId).select('_id');

  if (!hostUser) {
    throw new Error('Host user not found');
  }

  if (participantUserId) {
    const participantUser = await User.findById(participantUserId).select('_id');

    if (!participantUser) {
      throw new Error('Participant user not found');
    }
  }

  const callSession = await CallSession.create({
    sessionId: randomUUID(),
    hostUser: hostUserId,
    participantUser: participantUserId || null,
    sessionType: normalizedSessionType,
    status: 'active',
    startedAt: new Date(),
    endedAt: null,
    duration: 0
  });

  console.log(
    '[callService] createCallSession success',
    JSON.stringify(
      {
        sessionId: callSession.sessionId,
        hostUserId: String(callSession.hostUser),
        participantUserId: callSession.participantUser ? String(callSession.participantUser) : null,
        sessionType: callSession.sessionType,
        status: callSession.status
      },
      null,
      2
    )
  );

  return callSession;
}

export async function endCallSession({ sessionId, userId }) {
  const callSession = await CallSession.findOne({ sessionId });

  if (!callSession) {
    return null;
  }

  if (String(callSession.hostUser) !== String(userId) && String(callSession.participantUser || '') !== String(userId)) {
    throw new Error('Not authorized to end this call session');
  }

  if (callSession.status === 'ended') {
    return callSession;
  }

  const endedAt = new Date();
  callSession.status = 'ended';
  callSession.endedAt = endedAt;
  callSession.duration = Math.max(0, Math.round((endedAt.getTime() - callSession.startedAt.getTime()) / 1000));

  await callSession.save();
  return callSession;
}

export async function getCallSessionById(sessionId) {
  return CallSession.findOne({ sessionId }).populate('hostUser participantUser', 'fullName profileImage profession company');
}