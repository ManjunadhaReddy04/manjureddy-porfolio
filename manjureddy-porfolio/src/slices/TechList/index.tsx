"use client";

import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { div } from "three/tsl";
import React from "react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "@/components/Heading";
import Bounded from "@/components/Bounded";

gsap.registerPlugin(ScrollTrigger);

export type TechListProps = SliceComponentProps<Content.TechListSlice>;

const TechList: FC<TechListProps> = ({ slice }) => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        scrollTrigger: {
          trigger:component.current,
          markers: true,
          start: "top bottom",
          end: "bottom top",
          scrub: 4,
        },
      });

      // Animate .tech-row elements
      t1.fromTo(
        ".tech-row",
        {
          x: (index) =>
            index % 2 === 0 ? gsap.utils.random(600, 400) : gsap.utils.random(-600, -400),
        },
        {
          x: (index) =>
            index % 2 === 0 ? gsap.utils.random(-600, -400) : gsap.utils.random(600, 400),
        }
      );
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden"
      ref={component}
    >
      <Bounded>
        <Heading size="lg" as="h2" className="mb-8">
          {slice.primary.heading}
        </Heading>
      </Bounded>
      {slice.primary.tech_tools.map(({ tech_color, tech_name }, outerIndex) => (
        <div
          key={outerIndex}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={tech_name || undefined}
        >
          {Array.from({ length: 35 }, (_, innerIndex) => (
            <React.Fragment key={innerIndex}>
              <span
                className="tech-tools text-4xl font-extrabold uppercase tracking-tighter"
                style={{
                  color:
                    innerIndex === 7 && tech_color ? tech_color : "inherit",
                }}
              >
                {tech_name}
              </span>
              <span className="text-1xl">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;