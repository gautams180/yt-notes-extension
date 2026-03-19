import React from 'react';
import ReactDOM from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

interface ShadowRootContainerOptions {
  containerId: string;
  mode?: 'open' | 'closed';
}

interface ShadowRootResult {
  shadowRoot: ShadowRoot;
  container: HTMLDivElement;
  renderReact: (component: React.ReactNode) => void;
  emotionCache: ReturnType<typeof createCache>;
}

// Create a shadow root container for React components
export function createShadowRootContainer(
  parentElement: Element,
  options: ShadowRootContainerOptions
): ShadowRootResult {
  const { containerId, mode = 'open' } = options;

  // Create the host element
  const hostElement = document.createElement('div');
  hostElement.id = containerId;
  parentElement.appendChild(hostElement);

  // Create shadow root
  const shadowRoot = hostElement.attachShadow({ mode });

  // Create a container inside shadow root for React
  const container = document.createElement('div');
  container.id = `${containerId}-react-root`;
  shadowRoot.appendChild(container);

  // Create Emotion cache that injects styles into shadow root
  const emotionCache = createCache({
    key: 'shadow',
    container: shadowRoot,
  });

  // Helper to render React components with Emotion support
  const renderReact = (component: React.ReactNode) => {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <CacheProvider value={emotionCache}>
          {component}
        </CacheProvider>
      </React.StrictMode>
    );
  };

  return {
    shadowRoot,
    container,
    renderReact,
    emotionCache,
  };
}

// Remove shadow root container by ID
export function removeShadowRootContainer(containerId: string): void {
  const element = document.getElementById(containerId);
  if (element) {
    element.remove();
  }
}
