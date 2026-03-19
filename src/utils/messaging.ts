import type { ExtensionMessage, ApiResponse, Bookmark } from '../types';

// Send message to content script in active tab
export async function sendToContentScript<T = Bookmark[]>(
  tabId: number,
  message: ExtensionMessage
): Promise<T | undefined> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, message);
    return response as T;
  } catch (error) {
    console.error('Failed to send message to content script:', error);
    return undefined;
  }
}

// Send message to background script (for API calls)
export async function sendToBackground<T = unknown>(
  message: ExtensionMessage
): Promise<ApiResponse<T>> {
  try {
    const response = await chrome.runtime.sendMessage(message);
    return response as ApiResponse<T>;
  } catch (error) {
    console.error('Failed to send message to background:', error);
    return { success: false, error: String(error) };
  }
}
