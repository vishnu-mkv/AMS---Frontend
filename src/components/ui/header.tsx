interface HeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string;
}

function Header({ title, subtitle, highlight }: HeaderProps) {
  return (
    <div className="font-barlow my-5 sm:my-8">
      <h1 className="font-semibold text-3xl">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-gray-500 text-lg">
          {subtitle} <span className="text-primary">{highlight}</span>{" "}
        </p>
      )}
    </div>
  );
}

export default Header;
