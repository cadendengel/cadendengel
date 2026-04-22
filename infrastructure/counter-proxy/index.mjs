const DEFAULT_ALLOWED_ORIGIN = 'https://cadendengel.com';
const COUNTER_API_BASE = 'https://api.counterapi.dev';
const API_PREFIX = '/api/counter';
const REQUEST_TIMEOUT_MS = 8000;

const buildCorsHeaders = () => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Vary': 'Origin',
  };
};

const stripApiPrefix = (pathValue) => {
  if (!pathValue) return '/';
  if (!pathValue.startsWith(API_PREFIX)) return pathValue.startsWith('/') ? pathValue : `/${pathValue}`;
  const stripped = pathValue.slice(API_PREFIX.length);
  return stripped ? stripped : '/';
};

const resolveProxyPath = (event) => {
  const proxyParam = event?.pathParameters?.proxy;
  if (proxyParam) {
    return `/${proxyParam}`;
  }

  const rawPath = event?.rawPath || event?.requestContext?.http?.path || event?.path || '/';
  return stripApiPrefix(rawPath);
};

const resolveQueryString = (event) => {
  if (event?.rawQueryString) {
    return event.rawQueryString;
  }

  const query = event?.queryStringParameters;
  if (!query || typeof query !== 'object') return '';

  return new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();
};

const makeJsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    ...buildCorsHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method || event?.httpMethod || 'GET';

  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: buildCorsHeaders(),
      body: '',
    };
  }

  if (method !== 'GET') {
    return makeJsonResponse(405, { error: 'Method not allowed' });
  }

  const upstreamPath = resolveProxyPath(event);
  const queryString = resolveQueryString(event);
  const upstreamUrl = `${COUNTER_API_BASE}${upstreamPath}${queryString ? `?${queryString}` : ''}`;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: abortController.signal,
    });

    const bodyText = await upstreamResponse.text();
    console.log('Upstream status:', upstreamResponse.status, 'Body length:', bodyText.length, 'URL:', upstreamUrl);

    if (upstreamResponse.status >= 500) {
      return makeJsonResponse(200, {
        value: null,
        unavailable: true,
      });
    }

    const contentType = upstreamResponse.headers.get('content-type') || 'application/json; charset=utf-8';

    return {
      statusCode: upstreamResponse.status,
      headers: {
        ...buildCorsHeaders(),
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
      body: bodyText,
    };
  } catch (error) {
    console.error('Fetch error:', error.message, 'Type:', error.name, 'URL:', upstreamUrl);
    const isTimeout = error?.name === 'AbortError';
    return makeJsonResponse(isTimeout ? 504 : 502, {
      error: isTimeout ? 'Counter upstream timed out' : 'Counter upstream unavailable',
    });
  } finally {
    clearTimeout(timeout);
  }
};