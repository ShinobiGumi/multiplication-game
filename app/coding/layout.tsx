export default function CodingLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }