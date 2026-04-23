import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const DEFAULT_ALLOWED_ORIGIN = 'https://cadendengel.com';
const API_PREFIX = '/api/counter';
const TABLE_NAME = process.env.COUNTER_TABLE_NAME;

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

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

const parseCounterRoute = (counterPath) => {
  const parts = counterPath.split('/').filter(Boolean);
  if (parts.length < 3 || parts[0] !== 'v1') {
    return null;
  }

  const [, namespace, counterName, action] = parts;
  const shouldIncrement = action === 'up';

  if (!namespace || !counterName || (action && action !== 'up')) {
    return null;
  }

  return {
    namespace,
    counterName,
    shouldIncrement,
  };
};

const makeCounterKey = (namespace, counterName) => `${namespace}#${counterName}`;

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

  if (!TABLE_NAME) {
    return makeJsonResponse(500, { error: 'Counter table is not configured' });
  }

  const counterPath = resolveProxyPath(event);
  const route = parseCounterRoute(counterPath);

  if (!route) {
    return makeJsonResponse(400, { error: 'Invalid counter path' });
  }

  const counterId = makeCounterKey(route.namespace, route.counterName);

  try {
    if (route.shouldIncrement) {
      const updateResult = await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { counterId },
          UpdateExpression: 'SET #value = if_not_exists(#value, :start) + :increment, #updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#value': 'value',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':start': 0,
            ':increment': 1,
            ':updatedAt': new Date().toISOString(),
          },
          ReturnValues: 'UPDATED_NEW',
        })
      );

      return makeJsonResponse(200, {
        value: Number(updateResult.Attributes?.value ?? 0),
      });
    }

    const getResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { counterId },
      })
    );

    return makeJsonResponse(200, {
      value: Number(getResult.Item?.value ?? 0),
    });
  } catch {
    return makeJsonResponse(500, {
      error: 'Counter service unavailable',
    });
  }
};
