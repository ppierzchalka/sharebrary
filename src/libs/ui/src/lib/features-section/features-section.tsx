import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils';
import { Card, CardContent } from '../card';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FeaturesSectionProps {
  features: Feature[];
  title?: string;
  description?: string;
  className?: string;
}

export function FeaturesSection({
  features,
  title = 'Why Choose Sharebrary?',
  description,
  className,
}: FeaturesSectionProps) {
  return (
    <section className={cn('py-16 bg-muted/30', className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }, index) => (
            <Card
              key={index}
              className="bg-card rounded-lg p-6 text-center shadow-sm"
            >
              <CardContent className="pt-0 px-0">
                {/* Icon */}
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3">{title}</h3>

                {/* Description */}
                <p className="text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
