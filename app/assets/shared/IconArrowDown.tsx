import type { SVGProps } from "react";

function SvgIconArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={10} height={7} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m1 1 4 4 4-4"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
}

export default SvgIconArrowDown;
