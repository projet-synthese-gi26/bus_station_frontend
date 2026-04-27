import {Variants} from "framer-motion";

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
}


export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9 } },
}

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9 } },
}

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

export const itemVariants: Variants = {
    hidden: {y: 20, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {duration: 0.5},
    },
}

export const containerVariants: Variants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
}

export const pathVariants : Variants = {
    hidden: {pathLength: 0, opacity: 0},
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 2,
            ease: "easeInOut",
        },
    },
}

export const cloudVariants: Variants = {
    hidden: {x: -100, opacity: 0},
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 1.5,
            ease: "easeOut",
        },
    },
}


export const planeVariants: Variants = {
    hidden: {x: -100, y: 50, opacity: 0},
    visible: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeOut",
        },
    },
    hover: {
        y: -5,
        x: 5,
        transition: {
            duration: 0.3,
           // yoyo: Number.POSITIVE_INFINITY,
        },
    },
}

