"use client";
import { motion,useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function MotionReveal({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){const reduce=useReducedMotion();return <motion.div initial={reduce?{opacity:0}:{opacity:0,y:20,scale:.985}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true,amount:.15}} transition={{duration:reduce ? 0.15 : 0.5,delay:reduce?0:delay,ease:"easeOut"}} className={className}>{children}</motion.div>}
