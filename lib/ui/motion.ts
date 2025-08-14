export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.2, 0.8, 0.2, 1] } }
}

export const popIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 320, damping: 24 } }
}

export const stagger = { 
  animate: { transition: { staggerChildren: 0.06 } } 
}

export const scaleTap = { 
  whileTap: { scale: 0.98 } 
}
