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
/**
 * Remove Lovable AI badge – Force Mode
 */
export const removeLovableBadge = () => {
  const killBadge = () => {
    // محاولة حذف عادي
    const badge = document.querySelector("#lovable-badge");
    if (badge) {
      badge.remove();
    }

    // محاولة إخفاء بأي selector محتمل
    document.querySelectorAll('#lovable-badge, [id*="lovable"], [class*="lovable"]').forEach((el) => {
      el.style.display = "none";
      el.style.visibility = "hidden";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    });
  };

  // تشغيل فوري
  killBadge();

  // كل 100ms (Lovable بيعيد الحقن)
  const interval = setInterval(killBadge, 100);

  // مراقبة أي DOM جديد
  const observer = new MutationObserver(killBadge);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

// تشغيل تلقائي
removeLovableBadge();

export const CUSTOM_CODE_VERSION = "1.0.0";
