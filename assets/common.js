(function () {
  'use strict';
  var NS = (window.CICADA = {});
  var lp = 'length';

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  NS.aligned = function () {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    return (h === 11 && m >= 45) || h === 14;
  };

  NS.nowStr = function () {
    var d = new Date();
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  };

  NS.isMarked = function () { return localStorage.getItem('marked_1145') === '1'; };
  NS.mark = function () { localStorage.setItem('marked_1145', '1'); };
  NS.passed = function () { return localStorage.getItem('passed_1145') === '1'; };
  NS.setPassed = function () { localStorage.setItem('passed_1145', '1'); };

  function rightRotate(v, a) { return (v >>> a) | (v << (32 - a)); }

  function sha256js(ascii) {
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var i, j;
    var result = '';
    var words = [];
    var asciiBitLength = ascii[lp] * 8;
    var hash = sha256js.h = sha256js.h || [];
    var k = sha256js.k = sha256js.k || [];
    var primeCounter = k[lp];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii[lp] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lp]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lp]] = ((asciiBitLength / maxWord) | 0);
    words[words[lp]] = (asciiBitLength);
    for (j = 0; j < words[lp];) {
      var w = words.slice(j, j += 16);
      var oldHash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0);
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  }

  NS.hashHex = function (str) {
    try {
      if (window.crypto && crypto.subtle && window.isSecureContext) {
        var data = new TextEncoder().encode(str);
        return crypto.subtle.digest('SHA-256', data).then(function (buf) {
          var a = new Uint8Array(buf);
          var out = '';
          for (var i = 0; i < a.length; i++) { out += ((a[i] < 16) ? '0' : '') + a[i].toString(16); }
          return out;
        });
      }
    } catch (e) {}
    var h = sha256js(str);
    if (h === '') {
      return Promise.reject(new Error('non-ascii'));
    }
    return Promise.resolve(h);
  };

  NS.typeLine = function (el, text, speed, done) {
    var i = 0;
    el.textContent = '';
    (function tick() {
      if (i < text[lp]) {
        el.textContent = text.slice(0, ++i);
        setTimeout(tick, speed || 16);
      } else if (done) { done(); }
    })();
  };

  NS.runTyping = function (selector, done) {
    var els = [].slice.call(document.querySelectorAll(selector));
    var i = 0;
    (function next() {
      if (i >= els[lp]) { if (done) { done(); } return; }
      var el = els[i];
      NS.typeLine(el, el.getAttribute('data-type') || el.textContent, 16, function () {
        i++;
        next();
      });
    })();
  };

  NS.banner = function () {
    console.log('%cCICADA%c 1145',
      'color:#9fd8a8;font-size:18px;font-weight:bold;font-family:Consolas,monospace',
      'color:#5a5a64;font-size:18px;font-family:Consolas,monospace');
    console.log('%cVERITAS OMNIA VINCIT', 'color:#5a5a64;font-family:Consolas,monospace');
  };

  var audioCtx = null;
  function ctx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); }
    return audioCtx;
  }

  NS.startDrone = function () {
    var ac = ctx();
    if (!ac) { return; }
    var g = ac.createGain();
    g.gain.value = 0.035;
    var lp2 = ac.createBiquadFilter();
    lp2.type = 'lowpass';
    lp2.frequency.value = 160;
    var o1 = ac.createOscillator();
    o1.type = 'sawtooth';
    o1.frequency.value = 52;
    var o2 = ac.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = 52 * 1.498;
    var lfo = ac.createOscillator();
    lfo.frequency.value = 0.2;
    var lfoG = ac.createGain();
    lfoG.gain.value = 0.012;
    o1.connect(g);
    o2.connect(g);
    g.connect(lp2);
    lp2.connect(ac.destination);
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    o1.start();
    o2.start();
    lfo.start();
  };

  NS.startChord = function () {
    var ac = ctx();
    if (!ac) { return; }
    var g = ac.createGain();
    g.gain.value = 0.06;
    g.connect(ac.destination);
    [261.63, 329.63, 392.0].forEach(function (f, i) {
      var o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      var og = ac.createGain();
      og.gain.value = 0;
      og.gain.setValueAtTime(0, ac.currentTime);
      og.gain.linearRampToValueAtTime(0.35, ac.currentTime + 0.6 + i * 0.15);
      o.connect(og);
      og.connect(g);
      o.start();
    });
    g.gain.setValueAtTime(0.06, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 4);
  };

  NS.systemInfo = function () {
    var ua = navigator.userAgent || 'unknown';
    var m = ua.match(/(Chrome|Firefox|Safari|Edg|Opera)\/?\s*([\d.]+)/);
    var rows = [];
    rows.push(['系统', navigator.platform || 'unknown']);
    rows.push(['浏览器', m ? m[1] + ' ' + m[2] : 'unknown']);
    rows.push(['语言', navigator.language || 'unknown']);
    rows.push(['时区', (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return 'unknown'; } })()]);
    rows.push(['屏幕', screen.width + 'x' + screen.height]);
    rows.push(['CPU核心', navigator.hardwareConcurrency || '?']);
    if (navigator.deviceMemory) { rows.push(['内存(GB)', String(navigator.deviceMemory)]); }
    rows.push(['本地时间', new Date().toString()]);
    rows.push(['标记', 'MARKED_1145']);
    return rows;
  };

  NS.titleWatch = function () {
    document.addEventListener('visibilitychange', function () {
      document.title = (document.hidden ? 'CICADA 1145 // 我们还在看着你' : 'CICADA 1145');
    });
  };

  NS.initPage = function (page) {
    NS.banner();
    if (page === 'index') {
      console.log('%c不要告诉别人这个页面。', 'color:#5a5a64;font-family:Consolas,monospace');
      NS.titleWatch();
    } else if (page === 'door') {
      console.log('%c钥匙不会自己走进来。', 'color:#5a5a64;font-family:Consolas,monospace');
    } else if (page === 'badend') {
      console.error('%cERROR: TRUST BROKEN // MARKED_1145', 'color:#ff4d4d;font-family:Consolas,monospace');
      console.error('%c你本不该来的。', 'color:#ff4d4d;font-family:Consolas,monospace');
      setTimeout(function () { console.error('%c不要刷新。刷新没有用。', 'color:#5a5a64;font-family:Consolas,monospace'); }, 4000);
    } else if (page === 'end') {
      console.log('%cVERITAS. SAPERE AUDE.', 'color:#9fd8a8;font-family:Consolas,monospace');
    } else if (page === 'clock') {
      console.log('%c时间会告诉你答案。', 'color:#5a5a64;font-family:Consolas,monospace');
    }
  };
})();
