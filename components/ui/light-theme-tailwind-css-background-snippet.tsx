import { cn } from "@/lib/utils";

interface RadialBackgroundProps {
  className?: string;
  color?: string; // Optional dynamic product color override (e.g. hex or tailwind arbitrary)
}

export const RadialBackground = ({ className, color = "#63e" }: RadialBackgroundProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 size-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,var(--radial-color,#63e)_100%)]",
        className
      )}
      style={{ ["--radial-color" as any]: color }}
    />
  );
};
