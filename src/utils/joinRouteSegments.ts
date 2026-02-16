/**
 * It joins route segments in one string with forward slash (and checks that there is just one the slash between segments)
 * @param {string[]} segments accept route segments like ['package', 'author', 'name]
 * @returns {string} "package/author/name"
 * */
function joinRouteSegments(...segments: string[]) {
  const routeSegmentSeparator = '/';

  const parts = segments.slice();

  const sanitizedSegments: string[] = [];

  let currentSegment = parts.shift();
  while (currentSegment != null) {
    if (
      currentSegment.startsWith('http://') ||
      currentSegment.startsWith('https://')
    ) {
      sanitizedSegments.push(currentSegment);
      currentSegment = parts.shift();
      continue;
    }

    let separatorIndex = currentSegment.indexOf(routeSegmentSeparator);
    if (separatorIndex === -1) {
      sanitizedSegments.push(currentSegment);
      currentSegment = parts.shift();
      continue;
    }

    const segment = currentSegment.substring(0, separatorIndex);
    sanitizedSegments.push(segment);

    currentSegment = currentSegment.substring(separatorIndex + 1);
  }

  return sanitizedSegments
    .filter((segment) => segment !== '')
    .join(routeSegmentSeparator);
}

export { joinRouteSegments };
