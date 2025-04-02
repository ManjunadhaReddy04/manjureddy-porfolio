
import { asImageSrc, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";



export default async function ContentBody({page}: {
    page : Content.BlogPostDocument | Content.ProjectDocument;
}) {
  const params = { uid: "default-uid" }; // Replace with actual logic to get params
  const { uid } = params;

  

  return (
    <Bounded as="article">
      <div className="rounded-2x1 border-2 border-slate-800 bg-slate-900  px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1" >
          {page.data.title}
        </Heading>
        <div className="flex gap-4 text-yellow-400 text-x1 font-bold ">
           { page.tags
               .filter((tag: any) => typeof tag === "string" || typeof tag === "number")
               .map((tag: string | number) => (
                <span key={tag}>{tag}</span>
            ))}

        </div>
   <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">

    {page.data.date}
   </p>
   <div className="prose prose-lg prose-invert mt-12 w-full max-w-none mx:mt-20">

   </div>

  <SliceZone slices={page.data.slices} components={components} />;
      </div>
  </Bounded>
);}


