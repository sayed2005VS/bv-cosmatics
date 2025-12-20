/**
 * ⚠️ CUSTOM CODE DIRECTORY - DO NOT MODIFY ⚠️
 *
 * This file exports all custom code from the src/custom directory.
 * Any code placed here is protected and maintained manually.
 *
 * Usage:
 * import { yourFunction } from '@/custom';
 */

// ================================
// Remove #lovable-badge (High Priority)
// ================================
export const removeLovableBadge = () => {
  const removeBadge = () => {
    const badge = document.querySelector("#lovable-badge");
    if (badge) {
      badge.remove();
    }
  };

  // تشغيل فوري
  removeBadge();

  // مراقبة الصفحة لو العنصر اتضاف لاحقًا
  const observer = new MutationObserver(removeBadge);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

// تشغيل تلقائي بأعلى أولوية
removeLovableBadge();

// ================================
// Placeholder export to prevent empty module error
// ================================
export const CUSTOM_CODE_VERSION = "1.0.0";
