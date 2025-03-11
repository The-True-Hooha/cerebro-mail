import VariableFontHoverByLetter from './ui/features';

export default function FeaturesPreview() {
  return (
    <div className="flex h-full flex-col p-4 lg:justify-center">
      <h2 className="text-hotOrange mb-4 text-xl font-medium tracking-wider">Features</h2>

      <ul className="flex cursor-pointer flex-col gap-2">
        <VariableFontHoverByLetter
          label="INSTANT SETUP"
          staggerDuration={0.03}
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' -10"
          className="text-sm lg:text-base"
        />
        <VariableFontHoverByLetter
          label="AI POWERED"
          staggerDuration={0.03}
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' -10"
          className="text-sm lg:text-base"
        />
        <VariableFontHoverByLetter
          label="24/7 SUPPORT"
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' -10"
          staggerFrom={'last'}
          className="text-sm lg:text-base"
        />
        <VariableFontHoverByLetter
          label="TEAM COLLABORATION"
          staggerFrom={'center'}
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' -10"
          className="text-sm lg:text-base"
        />
        <VariableFontHoverByLetter
          label="CUSTOM DOMAINS"
          staggerDuration={0.02}
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' -10"
          className="text-sm lg:text-base"
        />
      </ul>

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-medium text-[#333]">Perfect for</h3>
        <div className="flex flex-wrap">
          <span className="mb-1 mr-1 inline-block rounded-md bg-[#1A426315] px-2 py-1 text-xs">
            Newsletters
          </span>
          <span className="mb-1 mr-1 inline-block rounded-md bg-[#1A426315] px-2 py-1 text-xs">
            Marketing
          </span>
          <span className="mb-1 mr-1 inline-block rounded-md bg-[#1A426315] px-2 py-1 text-xs">
            Transactional
          </span>
          <span className="mb-1 mr-1 inline-block rounded-md bg-[#1A426315] px-2 py-1 text-xs">
            Automation
          </span>
        </div>
      </div>
    </div>
  );
}
