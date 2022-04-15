import type { SVGProps } from "react";

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={9}
      height={9}
      viewBox="0 0 9 9"
      {...props}
    >
      <text
        fill="currentColor"
        fillRule="evenodd"
        fontFamily="inherit"
        fontSize="inherit"
        fontWeight="inherit"
        transform="translate(-24 -20)"
      >
        <tspan x={24} y={27.5}>
          {"+"}
        </tspan>
      </text>
    </svg>
  );
}

export default IconPlus;
