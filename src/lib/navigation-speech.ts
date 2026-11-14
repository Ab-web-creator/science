export const manualNavigationEvent = "little-orbit:manual-navigation";

export function stopForNavigation() {
  // Fire before router.push/replace so playback stops while a page is loading.
  window.dispatchEvent(new Event(manualNavigationEvent));
}
