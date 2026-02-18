export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <p className="text-center text-sm/6 text-muted">
          &copy; {currentYear} ThemeGen, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
