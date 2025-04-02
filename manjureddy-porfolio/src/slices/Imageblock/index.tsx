import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `Imageblock`.
 */
export type ImageblockProps = SliceComponentProps<Content.ImageblockSlice>;

/**
 * Component for "Imageblock" Slices.
 */
const Imageblock: FC<ImageblockProps> = ({ slice }) => {
  return (
    <PrismicNextImage field={slice.primary.image} imgixParams={{ w: 600 }} />
  );
};

export default Imageblock;
