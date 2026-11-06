import Image from "next/image";
import type { CoreValue } from "../types/home.type";

type CoreValueIconProps = Pick<CoreValue, "iconKey">;

const icons: Record<CoreValue["iconKey"], string> = {
  heart: "/images/core-values/than-thuong.png",
  care: "/images/core-values/tan-tam.png",
  honesty: "/images/core-values/trung-thuc.png",
  innovation: "/images/core-values/tan-tien.png",
};

/** Fills its parent box; decorative because the value's name is shown next to it. */
export function CoreValueIcon({ iconKey }: CoreValueIconProps) {
  return (
    <span className="relative block h-full w-full">
      <Image alt="" className="object-contain" fill sizes="96px" src={icons[iconKey] ?? icons.heart} />
    </span>
  );
}
