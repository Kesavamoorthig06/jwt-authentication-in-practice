// Teaching module. No HTTP server, persistence, CSRF or rate limiter is included.
const jwt = require('jsonwebtoken');
const { randomUUID, randomBytes, createHash } = require('node:crypto');
const ISSUER = 'api.tiffintime.app';
const AUDIENCE = 'tiffintime-api';
const ACCESS_SECONDS = 900;

function issueAccess(userId, secret) {
  if (typeof userId !== 'string' || !userId) throw new Error('subject');
  return jwt.sign({ use: 'access' }, secret, {
    algorithm: 'HS256', subject: userId, jwtid: randomUUID(),
    issuer: ISSUER, audience: AUDIENCE, expiresIn: ACCESS_SECONDS,
  });
}

function verifyAccess(header, secret, now = Math.floor(Date.now() / 1000)) {
  const m = typeof header === 'string'
    ? /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i.exec(header)
    : null;
  if (!m) throw new Error('invalid_token');
  const p = jwt.verify(m[1], secret, {
    algorithms: ['HS256'], issuer: ISSUER, audience: AUDIENCE,
    clockTimestamp: now, clockTolerance: 30,
  });
  if (!p || typeof p !== 'object' || Array.isArray(p)
    || p.use !== 'access' || typeof p.sub !== 'string' || !p.sub
    || typeof p.jti !== 'string' || !p.jti
    || !Number.isInteger(p.iat) || !Number.isInteger(p.exp)
    || p.iat > now + 30 || p.exp <= p.iat
    || p.exp - p.iat > ACCESS_SECONDS) throw new Error('invalid_token');
  return p;
}

function newRefresh() {
  const raw = randomBytes(32).toString('base64url');
  const hash = createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

function canReadOrder(subject, order) {
  return order !== null && order.ownerId === subject;
}
module.exports = { issueAccess, verifyAccess, newRefresh, canReadOrder };
