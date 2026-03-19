import type { ExtensionMessage, ApiResponse } from '../types';
import { api } from '../services/api';

// Listen for tab updates to detect YouTube video navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.includes('youtube.com/watch')
  ) {
    const queryParameters = tab.url.split('?')[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const videoId = urlParameters.get('v');

    if (videoId) {
      chrome.tabs.sendMessage(tabId, {
        type: 'NEW',
        videoId: videoId,
        value: '',
      }).catch((error) => {
        // Content script not ready yet, ignore
        console.log('Content script not ready:', error.message);
      });
    }
  }
});

// Listen for API requests from content scripts and popup
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === 'API_REQUEST') {
    handleApiRequest(message)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          success: false,
          error: error.message,
        } as ApiResponse);
      });
    return true; // Keep message channel open for async response
  }
});

// Handle API requests from other parts of the extension
async function handleApiRequest(
  message: ExtensionMessage & { type: 'API_REQUEST' }
): Promise<ApiResponse> {
  try {
    const { endpoint, method, body } = message;
    
    let data: unknown;
    switch (method) {
      case 'GET':
        data = await api.get(endpoint);
        break;
      case 'POST':
        data = await api.post(endpoint, body);
        break;
      case 'PUT':
        data = await api.put(endpoint, body);
        break;
      case 'DELETE':
        data = await api.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
