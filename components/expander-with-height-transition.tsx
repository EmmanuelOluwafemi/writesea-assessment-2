import React, { useMemo } from "react";

/**
 * ExpanderWithHeightTransition is a div wrapper with built-in transition animation based on height.
 * If expanded is true, it slowly expands its content and vice versa.
 *
 * Note: There is no easy way to animate height transition in CSS: https://github.com/w3c/csswg-drafts/issues/626.
 * This is a clever solution based on css grid and is borrowed from https://css-tricks.com/css-grid-can-do-auto-height-transitions/
 *
 */
export const ExpanderWithHeightTransition = React.memo(({
  expanded,
  children,
}: {
  expanded: boolean;
  children: React.ReactNode;
}) => {
  // Memoize the className to prevent recalculation
  // Use specific transitions instead of transition-all for better performance
  const containerClassName = useMemo(
    () => `grid overflow-hidden transition-[grid-template-rows,visibility] duration-300 ease-out ${
      expanded ? "visible" : "invisible"
    }`,
    [expanded]
  );

  // Memoize the style object to prevent recreation
  const containerStyle = useMemo(
    () => ({ gridTemplateRows: expanded ? "1fr" : "0fr" }),
    [expanded]
  );

  return (
    <div className={containerClassName} style={containerStyle}>
      <div className="min-h-0">{children}</div>
    </div>
  );
});

ExpanderWithHeightTransition.displayName = 'ExpanderWithHeightTransition';
