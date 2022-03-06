import { SVGProps } from "react";

function SvgIconNewFeedback(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient
          cx="103.9%"
          cy="-10.387%"
          fx="103.9%"
          fy="-10.387%"
          r="166.816%"
          id="icon-new-feedback_svg__a"
        >
          <stop stopColor="#E84D70" offset="0%" />
          <stop stopColor="#A337F6" offset="53.089%" />
          <stop stopColor="#28A7ED" offset="100%" />
        </radialGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <circle fill="url(#icon-new-feedback_svg__a)" cx={28} cy={28} r={28} />
        <path
          fill="#FFF"
          fillRule="nonzero"
          d="M30.343 36v-5.834h5.686v-4.302h-5.686V20h-4.597v5.864H20v4.302h5.746V36z"
        />
      </g>
    </svg>
  );
}

export default SvgIconNewFeedback;
