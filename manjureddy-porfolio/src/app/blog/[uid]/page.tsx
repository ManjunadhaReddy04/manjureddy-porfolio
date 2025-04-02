import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("blog_post", uid).catch(() => notFound());
  

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

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("blog_post", uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("blog_post");

  return pages.map((page) => ({ uid: page.uid }));
}