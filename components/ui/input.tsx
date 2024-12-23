import * as React from "react";
import { TextInput } from "react-native";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
	placeholderClassName?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
	({ className, placeholderClassName, ...props }, ref) => {
		return (
			<TextInput
				ref={ref}
				className={cn(
					"flex h-10 w-full rounded-base border-2 border-border px-3 py-2",
					"text-sm text-text font-base",
					"web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2",
					"native:h-12 native:text-lg native:leading-[1.25]",
					props.editable === false && "opacity-50 web:cursor-not-allowed",
					className
				)}
				placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
				{...props}
			/>
		);
	}
);

Input.displayName = "Input";

export { Input };
