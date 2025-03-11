import Footer from '@/components/footer';
import { FeaturesSectionDemo } from '@/components/ui/features-v2';
import WaitlistButton from '@/components/ui/waitlist-button';
import { Mails } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="flex flex-col items-center px-4 pt-20 sm:pt-16 md:pt-36">
        <h1 className="font-reckless text-hotOrange flex flex-wrap items-center justify-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="inline-block">Cerebro Mail</span>
          <span className="text-orangeWheel ml-1 inline-flex items-center sm:ml-2">
            <Mails className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
          </span>
        </h1>
        <p className="text-smokyBlack mx-auto mt-4 max-w-md text-center text-sm font-medium leading-snug sm:mt-6 sm:max-w-lg sm:text-base md:max-w-xl md:text-lg">
          The world is your oyster, send better emails on your own terms with rich features and
          ensured delivery
        </p>

        <div className="mt-10 flex flex-col items-center text-center">
          <h3 className="font-reckless text-hotOrange mb-4 text-[20px]">Access Early Release</h3>
          <WaitlistButton />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-screen-lg overflow-hidden px-4">
        <div className="hide-scrollbar max-h-[50vh] overflow-y-auto md:max-h-none md:overflow-visible">
          <FeaturesSectionDemo />
        </div>
      </div>

      <div className="mt-auto flex h-16 min-h-12 items-center justify-center border-t border-neutral-200">
        <Footer />
      </div>
    </div>
  );
}
