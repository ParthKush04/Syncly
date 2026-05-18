import { createCallSession, endCallSession } from '../services/callService.js';

export async function createCall(req, res, next) {
  try {
    const { participantUserId = null, sessionType = 'video' } = req.body || {};

    const callSession = await createCallSession({
      hostUserId: req.user._id,
      participantUserId,
      sessionType
    });

    return res.status(201).json({
      message: 'Call session created successfully',
      callSession: {
        sessionId: callSession.sessionId,
        hostUser: callSession.hostUser,
        participantUser: callSession.participantUser,
        sessionType: callSession.sessionType,
        status: callSession.status,
        startedAt: callSession.startedAt,
        endedAt: callSession.endedAt,
        duration: callSession.duration
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function endCall(req, res, next) {
  try {
    const { sessionId } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }

    const callSession = await endCallSession({
      sessionId,
      userId: req.user._id
    });

    if (!callSession) {
      return res.status(404).json({ message: 'Call session not found' });
    }

    return res.json({
      message: 'Call session ended successfully',
      callSession: {
        sessionId: callSession.sessionId,
        hostUser: callSession.hostUser,
        participantUser: callSession.participantUser,
        sessionType: callSession.sessionType,
        status: callSession.status,
        startedAt: callSession.startedAt,
        endedAt: callSession.endedAt,
        duration: callSession.duration
      }
    });
  } catch (error) {
    return next(error);
  }
}