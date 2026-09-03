import { db } from "@/db";
import { clients } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAuth, slugify } from "@/lib/admin-api";
import { z } from "zod";
export const dynamic="force-dynamic";
const input=z.object({name:z.string().trim().min(2),slug:z.string().optional(),logoUrl:z.string().min(1),logoAlt:z.string().optional().nullable(),websiteUrl:z.string().optional().nullable(),industry:z.string().optional().nullable(),location:z.string().optional().nullable(),row:z.coerce.number().int().min(1).max(2),workSummary:z.string().trim().min(3),description:z.string().optional(),servicesProvided:z.array(z.string()).default([]),projectDetails:z.string().default(""),sortOrder:z.coerce.number().int().default(0),featured:z.boolean().default(false),active:z.boolean().default(true)});
function values(b:z.infer<typeof input>){return {name:b.name,slug:slugify(b.slug||b.name),logoUrl:b.logoUrl,logoAlt:b.logoAlt||`${b.name} logo`,websiteUrl:b.websiteUrl||null,industry:b.industry||null,location:b.location||null,row:b.row,workSummary:b.workSummary,description:b.description||null,servicesProvided:b.servicesProvided,projectDetails:b.projectDetails,sortOrder:b.sortOrder,featured:b.featured,active:b.active,updatedAt:new Date()}}
export async function GET(){const unauth=await requireAuth();if(unauth)return unauth;return Response.json(await db.select().from(clients).orderBy(asc(clients.row),asc(clients.sortOrder)))}
export async function POST(req:Request){const unauth=await requireAuth();if(unauth)return unauth;try{const parsed=input.safeParse(await req.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||"Invalid client"},{status:400});const [row]=await db.insert(clients).values(values(parsed.data)).returning();return Response.json(row,{status:201})}catch(e){console.error(e);return Response.json({error:"Unable to create client. Check that the slug is unique."},{status:500})}}
