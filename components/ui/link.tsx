import React from 'react';
import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkVariants = cva(
    "inline-flex items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                navlink: "text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50",
                ctalink: "bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
                link: "items-center gap-2 px-3 py-1.5 text-sm font-medium underline-offset-4 hover:underline hover:text-muted-foreground transition-colors",
                brand: "items-center gap-2 text-lg font-bold tracking-tight text-foreground hover:text-primary transition-all duration-300 group",
                mobilenav: "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary transition-all duration-300 group border border-transparent hover:border-primary/20 hover:shadow-sm",
                sidebarnav: "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/20 hover:text-sidebar-accent-foreground group border border-transparent hover:shadow-sm relative overflow-hidden",
                adminpanel: "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 text-primary hover:text-primary-dark border border-primary/20 hover:border-primary/40 hover:shadow-lg group relative overflow-hidden"
            },
            size: {
                default: "",
                sm: "text-sm",
                lg: "text-lg",
                xl: "text-xl"
            },
            active: {
                true: "",
                false: ""
            }
        },
        compoundVariants: [
            {
                variant: "navlink",
                active: true,
                class: "text-foreground bg-accent"
            },
            {
                variant: "ctalink",
                size: "sm",
                class: "px-4 py-2 text-sm"
            },
            {
                variant: "ctalink",
                size: "lg",
                class: "px-8 py-4 text-lg"
            }
        ],
        defaultVariants: {
            variant: "link",
            size: "default",
            active: false
        }
    }
);

export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
    href: string;
    children: React.ReactNode;
    external?: boolean;
    disabled?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({
        className,
        variant,
        size,
        active,
        href,
        children,
        external = false,
        disabled = false,
        ...props
    }, ref) => {
        const linkClasses = cn(
            linkVariants({ variant, size, active, className }),
            disabled && "opacity-50 pointer-events-none"
        );

        if (external) {
            return (
                <a
                    ref={ref}
                    href={href}
                    className={linkClasses}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={disabled}
                    {...props}
                >
                    {children}
                </a>
            );
        }

        // Internal links using Next.js Link
        return (
            <NextLink
                href={href}
                className={linkClasses}
                aria-disabled={disabled}
                ref={ref}
                {...props}
            >
                {children}
            </NextLink>
        );
    }
);

Link.displayName = "Link";

export { Link, linkVariants };