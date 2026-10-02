import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESS, activeOffer, safeBusinessUrl, trackEvent } from '../src/business-config.js';

test('business links accept web URLs and reject executable or malformed schemes', () => {
  assert.equal(safeBusinessUrl('https://bakery.example/menu?item=cupcake'), 'https://bakery.example/menu?item=cupcake');
  assert.equal(safeBusinessUrl('http://localhost:5173/'), 'http://localhost:5173/');
  for (const value of ['', 'not a URL', 'javascript:alert(1)', 'data:text/html,<b>Offer</b>', 'file:///etc/passwd']) {
    assert.equal(safeBusinessUrl(value), '', value);
  }
});

test('public offers require owner-supplied title, terms, and an unexpired date', () => {
  const original = BUSINESS.publicOffer;
  const valid = { title: 'A configured public offer', description: 'Owner supplied.', terms: 'Owner supplied terms.', expires: '2026-10-02', url: 'https://bakery.example/offer' };
  try {
    BUSINESS.publicOffer = null;
    assert.equal(activeOffer(), null);
    BUSINESS.publicOffer = valid;
    assert.equal(activeOffer(new Date('2026-10-02T12:00:00')), valid);
    assert.equal(activeOffer(new Date('2026-10-03T00:00:00')), null);
    for (const field of ['title', 'terms', 'expires']) {
      BUSINESS.publicOffer = { ...valid, [field]: '' };
      assert.equal(activeOffer(new Date('2026-10-02T12:00:00')), null, `Missing ${field}`);
    }
    BUSINESS.publicOffer = { ...valid, expires: 'invalid-date' };
    assert.equal(activeOffer(new Date('2026-10-02T12:00:00')), null);
  } finally { BUSINESS.publicOffer = original; }
});

test('analytics are optional and never report unverified purchases or redemptions', () => {
  const original = BUSINESS.analytics;
  const events = [];
  try {
    BUSINESS.analytics = (name, metadata) => events.push({ name, metadata });
    trackEvent('start', { mode: 'quick' });
    trackEvent('completion', { mode: 'quick' });
    trackEvent('repeat-play', { mode: 'quick' });
    trackEvent('menu-click');
    trackEvent('order-link-click');
    trackEvent('purchase', { amount: 20 });
    trackEvent('redemption');
    assert.deepEqual(events.map(e => e.name), ['start', 'completion', 'repeat-play', 'menu-click', 'order-link-click']);
    assert.deepEqual(events[0].metadata, { mode: 'quick' });
    BUSINESS.analytics = () => { throw new Error('Provider unavailable'); };
    assert.doesNotThrow(() => trackEvent('start'));
    BUSINESS.analytics = null;
    assert.doesNotThrow(() => trackEvent('start'));
  } finally { BUSINESS.analytics = original; }
});
