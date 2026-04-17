/* ============================================
   GOOGLE RATING AUTO-SYNC
   Lit la note & le nombre d'avis depuis le widget Elfsight caché
   et met à jour nos éléments visibles.
   ============================================ */
(function () {
  'use strict';

  var ratingEl = document.querySelector('[data-elfsight-rating]');
  var countEl  = document.querySelector('[data-elfsight-count]');
  var starsEl  = document.querySelector('.reviews-stars');
  if (!ratingEl || !countEl) return;

  // Regex pour extraire "4.3" (ou "4,3") et "(1,599)" / "1 599" du widget
  var RATING_RE = /(\d[.,]\d)\s*(?:★|\*|stars?|étoiles?|sur\s*5|\/\s*5|\d\s*\d\s*\d\s*\d)/i;
  var COUNT_RE  = /\(([\d\s.,]+)\)|(\d[\d\s.,]{2,})\s*(?:avis|reviews)/i;

  function parseFloatFr(str) {
    return parseFloat(String(str).replace(',', '.'));
  }

  function formatRatingFr(val) {
    // 4.3 -> "4,3"
    return val.toFixed(1).replace('.', ',');
  }

  function formatCountFr(val) {
    // 1599 -> "1 599" (espace insécable)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  }

  function starsGlyphs(rating) {
    var full  = Math.floor(rating);
    var half  = (rating - full) >= 0.5;
    var empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '★' : '') + '☆'.repeat(empty);
  }

  function extractFromWidget() {
    // Le widget Elfsight rend son DOM au même niveau que notre page.
    // On cherche les nœuds contenant la note globale et le nombre d'avis.
    var container = document.querySelector('.elfsight-app-4c165ed5-c825-4c97-8625-f0610a7a37d9');
    if (!container) return null;
    var text = container.innerText || container.textContent || '';
    if (!text || text.length < 10) return null;

    // On cherche la première occurrence du pattern "4.3 ★★★★★ (1,599)"
    var ratingMatch = text.match(/(\d[.,]\d)\s*[★\*]/);
    if (!ratingMatch) ratingMatch = text.match(/^(\d[.,]\d)/m);
    var countMatch  = text.match(/\(\s*([\d\s.,]+)\s*\)/);

    if (!ratingMatch && !countMatch) return null;

    return {
      rating: ratingMatch ? parseFloatFr(ratingMatch[1]) : null,
      count:  countMatch  ? parseInt(countMatch[1].replace(/[\s.,]/g, ''), 10) : null
    };
  }

  function applyData(data) {
    if (!data) return false;
    var applied = false;

    if (data.rating && !isNaN(data.rating) && data.rating >= 1 && data.rating <= 5) {
      ratingEl.textContent = formatRatingFr(data.rating);
      if (starsEl) {
        starsEl.textContent = starsGlyphs(data.rating);
        starsEl.setAttribute('aria-label', formatRatingFr(data.rating) + ' étoiles sur 5');
      }
      applied = true;
    }
    if (data.count && !isNaN(data.count) && data.count > 0) {
      countEl.innerHTML = formatCountFr(data.count);
      applied = true;
    }
    return applied;
  }

  // Polling pendant que le widget Elfsight charge (~5-10s)
  var tries = 0;
  var MAX_TRIES = 30; // ~30 × 500ms = 15s max
  var poller = setInterval(function () {
    tries++;
    var data = extractFromWidget();
    if (applyData(data) || tries >= MAX_TRIES) {
      clearInterval(poller);
    }
  }, 500);
})();
