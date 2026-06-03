export default function Footer() {
   return (
      <footer className="mt-auto pt-12 pb-4 border-t border-zinc-200/40 dark:border-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
         <p>© 2026 Tinkinv Life Intuitif. Intelligent Core System.</p>
         <div className="flex items-center gap-4 opacity-70">
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Nodes</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Core API</span>
         </div>
      </footer>
   );
}
