/** Unwrap Laravel JsonResource single-resource payloads when wrapped in `data`. */
export function unwrapResource<T>(payload: T | { data: T }): T {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as { data: T }).data !== undefined &&
    (payload as { data: T }).data !== null
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}
