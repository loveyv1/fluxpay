'use client';
import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

export const slideIn: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};

export const stagger = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.2, 0, 0, 1] } },
});

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

export const listItem: Variants = {
  hidden:   { opacity: 0, y: 4 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
};

// Legacy support for common names
export const floatUp = slideIn;
export const revealUp = slideIn;
