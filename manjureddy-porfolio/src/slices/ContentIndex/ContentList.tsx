"use client";
import React, { useEffect, useRef, useState } from "react";
import{asImageSrc, Content, isFilled} from "@prismicio/client"
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import {gsap} from "gsap"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { url } from "inspector";

gsap.registerPlugin(ScrollTrigger)
type ContentListProps ={
    items : Content.BlogPostDocument[] | Content.ProjectDocument[];
    contentType : Content.ContentIndexSlice["primary"]["contenttype"];
    fallbackItemImage: Content.ContentIndexSlice["primary"][ "fallback_item_images"];
    viewMoreText: Content.ContentIndexSlice["primary"][ "view_more_text"];
}

export default function ContentList({items,contentType,fallbackItemImage,viewMoreText = "Read More",}:ContentListProps){
const components = useRef(null);
const revealRef = useRef(null);
const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
const [currentItem, setCurrentItem]=useState<null |number >(null)

const lastMousePos = useRef({x: 0, y: 0})
const urlPreFixes=contentType ==="Blog" ? "/blog" : "/projects";


useEffect(()=>{
    let ctx = gsap.context(()=>{
        itemsRef.current.forEach((items )=>{
            gsap.fromTo(items,
                {opacity :1 ,y:20},
                {opacity :5,
                  y : 0,
                  duration:1.3,
                  ease : "elastic.out(1,0.3)",
                  stagger:0.2,
                  scrollTrigger:  {
                    trigger :items,
                    start :"top bottom--100px",
                    end : "bottom center",
                    toggleActions:"Play none none none",

                  },
                }


            );

        });
        return ()=>ctx.revert
    },components);

},[]);


useEffect(()=>{
    const handleMouseMove =(e:MouseEvent)=>{
        const mousePos = {x: e.clientX,y:e.clientY + window.scrollY }

        //calculate speed and direction
        const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2))

        let ctx = gsap.context(()=>{
            if (currentItem !== null){
                const maxY = window.scrollY - window.innerHeight-350;
                const maxX = window.innerWidth - 250;

                gsap.to(revealRef.current,{
                    x:gsap.utils.clamp(0,maxX ,mousePos.x-110),
                    y:gsap.utils.clamp(0,maxY ,mousePos.y-160),
                    rotation : speed *  (mousePos.x > lastMousePos.current.x ? 1: -1),
                    ease : "back.out(2)",
                    duration:1.3,
                    opacity :1,
                });
            }
             lastMousePos.current=mousePos;
             return ()=> ctx.revert();
        },components);

    };
    window.addEventListener("mousemove",handleMouseMove)

    return ()=>{
        window.removeEventListener("mousemove",handleMouseMove)
    };
},[currentItem]);




    
   const contentImages = items.map((item)=>{
    const image =isFilled.image(item.data.hover_image) ? item.data.hover_image : fallbackItemImage;

    return asImageSrc(image,{
        fit :"crop",
        w:220,
        h:320,
        exp : -10
    })
   })

   useEffect (()=>{
    contentImages.forEach((url)=>{
        if (!url) return;
        const img = new Image();
        img.src =url;
    })
},[contentImages]);
    
   const onMouseEnter = (index: number)=>{
    setCurrentItem(index);
   }

   const onMouseLeave = ()=>{
    setCurrentItem(null);
   }

    return (
        <div ref={components}>
            <ul className="grid border-b border-b-slate-100" onMouseLeave={onMouseLeave}>
                {items.map((items,index)=>(
                    <>
                    {isFilled.keyText(items.data.title)&& ( 

                        
                        <li key={index} className="list-item opacity-0" onMouseDown={()=>onMouseEnter(index) }
                        ref ={(el) => { itemsRef.current[index] = el; }}
                        >
                    <Link href={urlPreFixes + "/" + items.uid} className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                    aria-label={items.data.title || ""}   >
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">
                                {items.data.title}
                                <div className="flex gap-3 text-yellow-400 text-lg font-bold">
                                    {items.tags.map((tags,index)=>(
                                        <span key={index}>{tags}</span>
                                    ))}
                                </div>
                            </span>
                        </div>
                        <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">{viewMoreText}
                            <MdArrowOutward/>
                        </span>
                    </Link>
                </li>
                )}
                </>
                ))}
            </ul>

            
            <div className="hover-reveal pointer-events-none absolute lef-0 top-0 -z-10 h-[320px] w-[220px] rounder-lg bg-over 
            bg-center opacity-0f transition-[background] duration-300 "
            style={{
                backgroundImage:currentItem !== null ? `url(${contentImages[currentItem]})`:" ",
            }}
            ref={revealRef}>

            </div>
        </div>
    )
}