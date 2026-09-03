import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { sendInquiryEmails } from "@/lib/mailer";
import { z } from "zod";

export const dynamic = "force-dynamic";
const attempts = new Map<string,{count:number;reset:number}>();
const schema=z.object({name:z.string().trim().min(2).max(255),email:z.string().trim().email(),phone:z.string().trim().min(7).max(60),company:z.string().trim().max(255).optional(),city:z.string().trim().max(160).optional(),subject:z.string().trim().max(255).optional(),productInterest:z.string().trim().max(255).optional(),solutionInterest:z.string().trim().max(255).optional(),projectType:z.string().trim().max(160).optional(),projectLocation:z.string().trim().max(255).optional(),quantity:z.string().trim().max(160).optional(),source:z.string().trim().max(80).optional(),message:z.string().trim().min(10).max(5000),consent:z.union([z.boolean(),z.literal("on")]),website:z.string().max(0).optional()});

export async function POST(req:Request){
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]||"local";const now=Date.now();const hit=attempts.get(ip);if(hit&&hit.reset>now&&hit.count>=5)return Response.json({error:"Too many requests. Please try again later."},{status:429});attempts.set(ip,{count:hit&&hit.reset>now?hit.count+1:1,reset:now+15*60*1000});
  try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||"Please check the form."},{status:400});const d=parsed.data;if(d.website)return Response.json({ok:true});
    const [row]=await db.insert(inquiries).values({name:d.name,email:d.email,phone:d.phone,company:d.company||null,city:d.city||null,subject:d.subject||null,productInterest:d.productInterest||null,solutionInterest:d.solutionInterest||null,projectType:d.projectType||null,projectLocation:d.projectLocation||null,quantity:d.quantity||null,message:d.message,consent:true,source:d.source||"contact"}).returning();
    const reference=`MSNSS-${new Date().getFullYear()}-${String(row.id).padStart(4,"0")}`;
    const mail=await sendInquiryEmails({id:row.id,reference,name:d.name,email:d.email,phone:d.phone,company:d.company||null,subject:d.subject||null,productInterest:d.productInterest||null,solutionInterest:d.solutionInterest||null,projectType:d.projectType||null,projectLocation:d.projectLocation||null,message:d.message,source:d.source||"contact",createdAt:row.createdAt});
    return Response.json({ok:true,id:row.id,reference,emailSent:mail.sent});
  }catch(error){console.error("Inquiry submission failed",error);return Response.json({error:"Your inquiry could not be submitted. Please call or email us."},{status:500});}
}
