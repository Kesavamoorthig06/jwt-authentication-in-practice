const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const {issueAccess, verifyAccess, newRefresh, canReadOrder} = require('./book-auth');
const S=crypto.randomBytes(32).toString('base64url');
const now=Math.floor(Date.now()/1000);
let passed=0;
function test(name, fn) { fn(); passed++; console.log('PASS',name); }
const good=issueAccess('user_42',S);
const hdr=t=>'Bearer '+t;
const base={sub:'user_42',use:'access',jti:'test-id',iat:now,exp:now+900};
const mk=(patch={},opts={})=>jwt.sign(Object.fromEntries(Object.entries({...base,...patch}).filter(([,v])=>v!==undefined)),S,{algorithm:'HS256',issuer:'api.tiffintime.app',audience:'tiffintime-api',...opts});
test('valid access',()=>assert.equal(verifyAccess(hdr(good),S).sub,'user_42'));
test('scheme is case insensitive',()=>assert.equal(verifyAccess('bEaReR '+good,S).sub,'user_42'));
for (const [name,t] of Object.entries({
 wrong_algorithm:mk({}, {algorithm:'HS512'}), wrong_issuer:mk({}, {issuer:'elsewhere'}),
 wrong_audience:mk({}, {audience:'another-api'}), expired:mk({iat:now-1000,exp:now-31}),
 future_nbf:mk({nbf:now+31}), wrong_purpose:mk({use:'refresh'}),
 missing_sub:mk({sub:undefined}), missing_exp:mk({exp:undefined}), missing_iat:mk({}, {noTimestamp:true}),
 missing_jti:mk({jti:undefined}), long_lifetime:mk({exp:now+901}), future_iat:mk({iat:now+31,exp:now+931}),
 invalid_order:mk({exp:now}), malformed:'x.y.z',
})) test(name,()=>assert.throws(()=>verifyAccess(hdr(t),S)));
test('wrong secret',()=>assert.throws(()=>verifyAccess(hdr(good),'another-secret')));
for (const h of ['',good,'Bearer '+good+' trailing','Basic '+good,undefined]) test('header rejected '+String(h).slice(0,12),()=>assert.throws(()=>verifyAccess(h,S)));
test('30 second tolerance permits exp 29 seconds ago',()=>verifyAccess(hdr(mk({iat:now-929,exp:now-29})),S));
test('new refresh has 32 bytes and matching digest',()=>{const t=newRefresh();assert.equal(Buffer.from(t.raw,'base64url').length,32);assert.equal(t.hash,crypto.createHash('sha256').update(t.raw).digest('hex'));});
test('owner may read',()=>assert.equal(canReadOrder('u1',{ownerId:'u1'}),true));
test('other owner denied',()=>assert.equal(canReadOrder('u1',{ownerId:'u2'}),false));
test('missing order denied',()=>assert.equal(canReadOrder('u1',null),false));
for(const [v,delta] of [[900,900],['15m',900],['900',0]]) test('expiresIn '+JSON.stringify(v),()=>{const p=jwt.decode(jwt.sign({sub:'u'},S,{expiresIn:v}));assert.equal(p.exp-p.iat,delta);});
console.log(passed+' checks passed');
