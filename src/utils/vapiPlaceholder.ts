// Vapi Voice Agent Integration
// Documentation: https://docs.vapi.ai

const VAPI_PUBLIC_KEY = '0c22dcea-0d6c-4fc0-8fb2-93292d8575e8';
const AGENT_ID = 'b67b4257-b25b-4027-95c0-2474dc7260e0';

let vapiInstance: any = null;

// Load Vapi SDK from CDN
const loadVapiSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).Vapi) {
      resolve((window as any).Vapi);
      return;
    }

    // Load from CDN
    const script = document.createElement('script');
    script.src =
    'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.js';
    script.onload = () => {
      if ((window as any).Vapi) {
        resolve((window as any).Vapi);
      } else {
        reject(new Error('Vapi SDK failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Vapi SDK'));
    document.head.appendChild(script);
  });
};

export const startVapiAgent = async (): Promise<void> => {
  console.log('Starting Vapi Agent...');

  try {
    // Load Vapi SDK from CDN
    const Vapi = await loadVapiSDK();
    vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

    // Start the call with your assistant
    await vapiInstance.start(AGENT_ID);

    // Listen to call events
    vapiInstance.on('call-start', () => {
      console.log('Call started - Bonsu is ready to talk');
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
    });

    vapiInstance.on('speech-start', () => {
      console.log('User started speaking');
    });

    vapiInstance.on('speech-end', () => {
      console.log('User stopped speaking');
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
    });
  } catch (error) {
    console.error('Failed to start Vapi agent:', error);
    throw error;
  }
};

export const endVapiCall = (): void => {
  if (vapiInstance) {
    console.log('Ending Vapi call...');
    vapiInstance.stop();
    vapiInstance = null;
  }
};