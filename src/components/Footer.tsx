const Footer = () => {
  return (
    <footer className="py-6 bg-gray-100 px-6 2xl:px-0 mt-12">
      <div className="container mx-auto flex flex-col gap-2">
        <p className="text-lg font-medium">FileDrive</p>
        <p>
          Built with:{" "}
          <span className="text-sm">
            Typescript - Nextjs - Convex - Clerk - Tailwind - Shadcn
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
