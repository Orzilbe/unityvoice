import Link from "next/link";

interface Button {
  href: string;
  label: string;
  className: string;
}

interface ButtonGroupProps {
  buttons: Button[];
}

export default function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
      {buttons.map((button, index) => (
        <Link
          key={index}
          href={button.href}
          className={`${button.className} px-6 py-2 text-white text-lg font-semibold rounded-lg shadow-md hover:transition-colors`}
        >
          {button.label}
        </Link>
      ))}
    </div>
  );
}
