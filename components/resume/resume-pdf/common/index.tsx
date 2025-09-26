import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import { spacing, styles } from "../styles";
import { DEBUG_RESUME_PDF_FLAG } from "@/lib/constants";

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: any;
  children: React.ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2"],
      marginTop: spacing["5"],
      ...style,
    }}
  >
    {heading && (
      <View style={{ ...styles.flexRow, alignItems: "center" }}>
        {themeColor && (
          <View
            style={{
              height: "3.75pt",
              width: "30pt",
              backgroundColor: themeColor,
              marginRight: spacing["3.5"],
            }}
            debug={DEBUG_RESUME_PDF_FLAG}
          />
        )}
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: "0.3pt", // tracking-wide -> 0.025em * 12 pt = 0.3pt
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
      </View>
    )}
    {children}
  </View>
);

// Memoized base styles for text components
const baseTextStyle = {
  color: "black",
  fontWeight: "normal" as const,
};

const boldTextStyle = {
  color: "black",
  fontWeight: "bold" as const,
};

export const ResumePDFText = React.memo(({
  bold = false,
  themeColor,
  style,
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: any;
  children: React.ReactNode;
}) => {
  // Use memoized base style and only override when necessary
  const baseStyle = bold ? boldTextStyle : baseTextStyle;
  const finalStyle = themeColor || style 
    ? {
        ...baseStyle,
        ...(themeColor && { color: themeColor }),
        ...style,
      }
    : baseStyle;

  return (
    <Text
      style={finalStyle}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
});

// Memoized styles to prevent recreation on every render
const bulletTextStyle = {
  paddingLeft: spacing["2"],
  paddingRight: spacing["2"],
  lineHeight: "1.3",
};

const itemTextStyle = {
  lineHeight: "1.3",
  flexGrow: 1,
  flexBasis: 0,
};

const rowStyle = {
  ...styles.flexRow,
};

export const ResumePDFBulletList = React.memo(({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  // Early return for empty items to avoid unnecessary rendering
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item, idx) => {
        // Skip empty items to improve performance
        if (!item || item.trim() === '') {
          return null;
        }
        
        return (
          <View style={rowStyle} key={idx}>
            {showBulletPoints && (
              <ResumePDFText
                style={bulletTextStyle}
                bold={true}
              >
                {"•"}
              </ResumePDFText>
            )}
            {/* A breaking change was introduced causing text layout to be wider than node's width
                https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
            <ResumePDFText style={itemTextStyle}>
              {item}
            </ResumePDFText>
          </View>
        );
      })}
    </>
  );
});

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style,
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: any;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
