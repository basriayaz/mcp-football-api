import { EventSource } from 'eventsource';

// Test SSE connection
console.log('Testing SSE connection...');

const eventSource = new EventSource('http://localhost:3000/sse');

eventSource.onopen = function(event) {
    console.log('SSE connection opened successfully!');
    console.log('Connection event:', event);
};

eventSource.onmessage = function(event) {
    console.log('Received SSE message:', event.data);
};

eventSource.onerror = function(event) {
    console.error('SSE connection error:', event);
};

eventSource.onclose = function(event) {
    console.log('SSE connection closed:', event);
};

// Keep the process running for a while
setTimeout(() => {
    console.log('Closing SSE connection...');
    eventSource.close();
    process.exit(0);
}, 10000);
