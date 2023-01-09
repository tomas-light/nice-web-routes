/**
 * It joins route segments in one string with forward slash (and checks that there is just one the slash between segments)
 * @param {string[]} segments accept route segments like ['package', 'author', 'name]
 * @returns {string} "package/author/name"
 * */
function joinRouteSegments(...segments: string[]) {
  const routeSegmentSeparator = '/';

  return segments
    .map((segment) => {
      if (segment.endsWith(routeSegmentSeparator)) {
        return segment.slice(0, segment.length - 2);
      }
      return segment;
    })
    .join(routeSegmentSeparator);
}

export { joinRouteSegments };
