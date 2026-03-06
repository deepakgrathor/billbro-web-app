// Standard Framer Motion animation variants for consistent UX

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

export const cardVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 260, damping: 20 },
};
