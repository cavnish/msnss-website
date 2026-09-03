import Link from "next/link";
import { SITE } from "@/lib/site";

const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.462 1.71 6.41L3.2 28.8l6.57-1.68a12.75 12.75 0 0 0 6.23 1.616h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.055A12.72 12.72 0 0 0 16.004 3.2Zm0 23.02h-.004a10.6 10.6 0 0 1-5.4-1.48l-.388-.23-4.006 1.024 1.07-3.906-.252-.4a10.58 10.58 0 0 1-1.622-5.648c0-5.86 4.77-10.63 10.63-10.63a10.56 10.56 0 0 1 7.512 3.115 10.56 10.56 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.63 10.63Zm5.83-7.96c-.32-.16-1.89-.93-2.183-1.037-.293-.107-.506-.16-.72.16-.213.32-.826 1.037-1.013 1.25-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.57-1.586-.95-.848-1.59-1.895-1.777-2.215-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.734-.986-2.375-.26-.623-.523-.538-.72-.548l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.253 3.44 5.46 4.826.763.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.89-.773 2.156-1.52.267-.746.267-1.386.187-1.52-.08-.133-.293-.213-.613-.373Z" />
    </svg>
  );
}

export function FloatingActions() {
  return (
    <>
      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-slate-200 bg-white shadow-[0_-4px_18px_rgba(0,0,0,.12)] md:hidden">
        <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-r border-slate-200 py-3 text-xs font-bold text-green-600">
          <WhatsAppIcon className="h-4 w-4" /> WHATSAPP
        </a>
        <Link href="/contact" className="bg-brand py-3 text-center text-xs font-bold text-white">GET QUOTE</Link>
      </div>

      {/* Desktop floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with MSNSS on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"
        >
          <WhatsAppIcon className="h-8 w-8" />
        </a>
      </div>
    </>
  );
}
