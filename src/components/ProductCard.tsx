"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/db/schema";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduce ? 0.15 : 0.45, delay: reduce ? 0 : Math.min(index * 0.05, 0.25) }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm outline-none transition hover:border-brand/50 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand sm:rounded-2xl"
      >
        <div className="zoom-frame relative aspect-square w-full overflow-hidden bg-slate-100 sm:aspect-[4/3]">
          <motion.img
            src={product.imageUrl}
            alt={`${product.name} manufactured by MSNSS`}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={reduce ? undefined : { scale: 1.07 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-slate-950/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
            {product.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <h3 className="line-clamp-2 text-sm font-bold text-ink transition group-hover:text-brand sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-slate-600 sm:mt-2 sm:line-clamp-3 sm:text-sm sm:leading-6">
            {product.shortDescription}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-4 sm:pt-4">
            <span className="text-[11px] text-slate-400 sm:text-xs">View details</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-brand transition group-hover:translate-x-1 group-hover:bg-brand group-hover:text-white sm:h-8 sm:w-8">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
