/* eslint-disable */
/**
 * Copied from https://github.com/pH200/hmacsha1-js/blob/master/index.js
 */

/**
 * Computes a HMAC-SHA1 code.
 *
 * @param {string} k Secret key.
 * @param {string} d Data to be hashed.
 * @return {string} The hashed string.
 */
export function HmacSHA1(k, d, _p = undefined, _z = undefined) {
  // heavily optimized and compressed version of http://pajhome.org.uk/crypt/md5/sha1.js
  // _p = b64pad, _z = character size; not used here but I left them available just in case
  if (!_p) {
    _p = '=';
  }
  if (!_z) {
    _z = 8;
  }
  function _f(t, b, c, d) {
    if (t < 20) {
      return (b & c) | (~b & d);
    }
    if (t < 40) {
      return b ^ c ^ d;
    }
    if (t < 60) {
      return (b & c) | (b & d) | (c & d);
    }
    return b ^ c ^ d;
  }
  function _k(t) {
    return t < 20
      ? 1518500249
      : t < 40
      ? 1859775393
      : t < 60
      ? -1894007588
      : -899497514;
  }
  function _s(x, y) {
    const l = (x & 0xffff) + (y & 0xffff);
    const m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xffff);
  }
  function _r(n, c) {
    return (n << c) | (n >>> (32 - c));
  }
  function _c(x, l) {
    x[l >> 5] |= 0x80 << (24 - (l % 32));
    x[(((l + 64) >> 9) << 4) + 15] = l;
    const w = [80];
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < x.length; i += 16) {
      const o = a;
      const p = b;
      const q = c;
      const r = d;
      const s = e;
      for (let j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = x[i + j];
        } else {
          w[j] = _r(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        }
        const t = _s(_s(_r(a, 5), _f(j, b, c, d)), _s(_s(e, w[j]), _k(j)));
        e = d;
        d = c;
        c = _r(b, 30);
        b = a;
        a = t;
      }
      a = _s(a, o);
      b = _s(b, p);
      c = _s(c, q);
      d = _s(d, r);
      e = _s(e, s);
    }
    return [a, b, c, d, e];
  }
  function _b(s) {
    const b = [];
    const m = (1 << _z) - 1;
    for (let i = 0; i < s.length * _z; i += _z) {
      b[i >> 5] |= (s.charCodeAt(i / 8) & m) << (32 - _z - (i % 32));
    }
    return b;
  }
  function _h(k, d) {
    let b = _b(k);
    if (b.length > 16) {
      b = _c(b, k.length * _z);
    }
    const p = [16];
    const o = [16];
    for (let i = 0; i < 16; i++) {
      p[i] = b[i] ^ 0x36363636;
      o[i] = b[i] ^ 0x5c5c5c5c;
    }
    const h = _c(p.concat(_b(d)), 512 + d.length * _z);
    return _c(o.concat(h), 512 + 160);
  }
  function _n(b) {
    const t =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let s = '';
    for (let i = 0; i < b.length * 4; i += 3) {
      const r =
        (((b[i >> 2] >> (8 * (3 - (i % 4)))) & 0xff) << 16) |
        (((b[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) & 0xff) << 8) |
        ((b[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) & 0xff);
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > b.length * 32) {
          s += _p;
        } else {
          s += t.charAt((r >> (6 * (3 - j))) & 0x3f);
        }
      }
    }
    return s;
  }
  function _x(k, d) {
    return _n(_h(k, d));
  }
  return _x(k, d);
}
