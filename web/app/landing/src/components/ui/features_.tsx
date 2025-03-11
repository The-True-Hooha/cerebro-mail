export default function FeaturesReel() {
  return (
    <ul className="flex flex-col gap-5 cursor-pointer font-abcDiatype text-orangeWheel font-semibold">
      <li className="group relative overflow-hidden">
        <div className="group-hover:text-hotOrange text-lg tracking-wide transition-colors hover:italic duration-300">
          INSTANT SETUP
          <div className="bg-hotOrange absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
        </div>
        <div className="absolute right-0 opacity-0 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-hotOrange h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </li>

      <li className="group relative overflow-hidden">
        <div className="group-hover:text-hotOrange text-lg tracking-wide transition-colors duration-300 hover:italic">
          SELF-HOST
          <div className="bg-hotOrange absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
        </div>
        <div className="absolute right-0 opacity-0 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-hotOrange h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </li>
      <li className="group relative overflow-hidden">
        <div className="group-hover:text-hotOrange text-lg tracking-wide transition-colors duration-300 hover:italic">
          AI INTEGRATED
          <div className="bg-hotOrange absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
        </div>
        <div className="absolute right-0 opacity-0 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-hotOrange h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </li>

      <li className="group relative overflow-hidden">
        <div className="group-hover:text-hotOrange text-lg tracking-wide transition-colors duration-300 hover:italic">
          24/7 SUPPORT
          <div className="bg-hotOrange absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
        </div>
        <div className="absolute right-0 opacity-0 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-hotOrange h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </li>

      <li className="group relative overflow-hidden">
        <div className="group-hover:text-hotOrange text-lg tracking-wide transition-colors duration-300 hover:italic">
          OWN DOMAIN
          <div className="bg-hotOrange absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-full"></div>
        </div>
        <div className="absolute right-0 opacity-0 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-hotOrange h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </li>
    </ul>
  );
}
