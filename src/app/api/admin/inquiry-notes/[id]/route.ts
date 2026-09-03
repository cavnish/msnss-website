import { db } from "@/db";import { inquiryNotes } from "@/db/schema";import { eq } from "drizzle-orm";import { requireAuth } from "@/lib/admin-api";
export async function DELETE(_req:Request,{params}:{params:Promise<{id:string}>}){const u=await requireAuth();if(u)return u;await db.delete(inquiryNotes).where(eq(inquiryNotes.id,Number((await params).id)));return Response.json({ok:true})}
