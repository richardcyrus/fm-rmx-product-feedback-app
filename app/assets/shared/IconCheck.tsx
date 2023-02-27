import type { SVGProps } from "react";

function SvgIconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={11} {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        d="M1 5.233 4.522 9 12 1"
      />
    </svg>
  );
}

export default SvgIconCheck;
