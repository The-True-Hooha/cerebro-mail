import { cn } from '@/lib/utils';
import { IconAdjustmentsBolt, IconCloud, IconCurrencyDollar, IconEaseInOut, IconHeart, IconHelp, IconRouteAltLeft, IconTerminal2 } from '@tabler/icons-react';


export function FeaturesSectionDemo() {
  const features = [
    {
      title: 'Own your Mail',
      description: 'Newsletters, bulk emails, cold outreach, automation, and campaigns.',
      icon: <IconHeart className="text-hotOrange" />,
    },

    {
      title: 'AI Integration',
      description: 'Prefer to use your own api keys? No problem. Supports GPT, Claude, Gemini etc. ',
      icon: <IconAdjustmentsBolt className="text-hotOrange" />,
    },
    {
      title: '24/7 Support',
      description: 'Expert assistance any time you need it.',
      icon: <IconHelp className="text-hotOrange" />,
    },
    {
      title: 'Own Domain',
      description: 'Use your domain or get a generated one with high deliverability.',
      icon: <IconCloud className="text-hotOrange" />,
    },
    {
      title: 'Deep Analytics',
      description: 'Track every aspect of your email performance.',
      icon: <IconRouteAltLeft className="text-hotOrange" />,
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with role-based permissions.',
      icon: <IconEaseInOut className="text-hotOrange" />,
    },
    {
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden costs.',
      icon: <IconCurrencyDollar className="text-hotOrange" />,
    },
    {
      title: 'Self Host',
      description: 'Get started with our docker image + technical support',
      icon: <IconTerminal2 className="text-hotOrange" />,
    },
  ];
  return (
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-4 md:py-10 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        'group/feature relative flex flex-col py-4 lg:py-6 lg:border-r border-orangeWheel',
        (index === 0 || index === 4) && 'lg:border-l border-orangeWheel',
        index < 4 && 'lg:border-b border-orangeWheel'
      )}
    >
      {index < 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-hotOrange/5 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      {index >= 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-hotOrange/5 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      <div className="relative z-10 mb-4 px-6 text-neutral-600">{icon}</div>
      <div className="relative z-10 mb-2 px-6 text-lg font-semibold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-hotOrange" />
        <span className="inline-block text-eerieLight font-light underline font-abcDiatype transition duration-200 group-hover/feature:translate-x-2">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-6 text-sm text-neutral-600">
        {description}
      </p>
    </div>
  );
};