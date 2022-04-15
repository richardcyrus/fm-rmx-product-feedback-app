import type { SVGProps } from "react";

function SvgIconArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={7} height={10} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 9 2 5l4-4"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
}

export default SvgIconArrowLeft;
