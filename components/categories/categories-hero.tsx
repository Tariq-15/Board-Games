export function CategoriesHero() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Game Categories</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover board games organized by genre and play style. Find the perfect game for your preferences and gaming
          group.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span>🎯 Strategy Games</span>
          <span>👨‍👩‍👧‍👦 Family Fun</span>
          <span>🎉 Party Games</span>
          <span>🤝 Cooperative</span>
          <span>🃏 Deck Building</span>
        </div>
      </div>
    </section>
  )
}
