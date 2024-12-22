import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";

import { TextClassContext } from "./text";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
	  variants: {
		variant: {
		  default:
			'text-mtext bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
		//   noShadow:
		// 	'text-mtext bg-main border-2 border-border',
		  neutral:
			'bg-bw text-text border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
		  reverse:
			'text-mtext bg-main border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
		},
		size: {
		  default: 'h-10 px-4 py-2',
		  sm: 'h-9 px-3',
		  lg: 'h-11 px-8',
		  icon: 'h-10 w-10',
		},
	  },
	  defaultVariants: {
		variant: 'default',
		size: 'default',
	  },
	},
  )

const buttonTextVariants = cva(
	"web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
	{
		variants: {
			variant: {
				default: "text-primary-foreground",
				neutral: "text-neutral-foreground",
				reverse: "text-reverse-foreground",
			},
			size: {
				default: "",
				sm: "",
				lg: "native:text-lg",
				icon: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	ButtonProps
>(({ className, variant, size, ...props }, ref) => {
	return (
		<TextClassContext.Provider
			value={buttonTextVariants({
				variant,
				size,
				className: "web:pointer-events-none",
			})}
		>
			<Pressable
				className={cn(
					props.disabled && "opacity-50 web:pointer-events-none",
					buttonVariants({ variant, size, className }),
				)}
				ref={ref}
				role="button"
				{...props}
			/>
		</TextClassContext.Provider>
	);
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
