import { Star, Check, Circle, ChevronUp } from "lucide-react";

function parseJsonArray(s: string): string[] {
  try {
    const a = JSON.parse(s);
    return Array.isArray(a) ? a : [s];
  } catch {
    return s ? [s] : [];
  }
}

type Product = { name: string };
type Intelligence = {
  keyFeatures: string;
  keyBenefits: string;
  targetPainPoints: string;
  primaryUseCases: string;
  targetScenarios: string;
  offers: string;
  valueProposition: string;
  positioningStatement?: string | null;
  uniqueSellingPoints: string;
  competitiveAdvantages: string;
};

export function IntelligencePanel({
  product,
  intelligence,
}: {
  product: Product;
  intelligence: Intelligence | null;
}) {
  if (!intelligence) {
    return (
      <div className="gro-card p-8 text-center">
        <p className="text-zinc-500 mb-2">No intelligence yet for this product.</p>
        <p className="text-sm text-zinc-600">
          Run &quot;Run research&quot; to analyze the product and site for features, pain points, offers, and value proposition.
        </p>
      </div>
    );
  }

  const keyFeatures = parseJsonArray(intelligence.keyFeatures);
  const keyBenefits = parseJsonArray(intelligence.keyBenefits);
  const painPoints = parseJsonArray(intelligence.targetPainPoints);
  const useCases = parseJsonArray(intelligence.primaryUseCases);
  const scenarios = parseJsonArray(intelligence.targetScenarios);
  let offers: { title: string; price?: string; savings?: string; includes?: string }[] = [];
  try {
    offers = JSON.parse(intelligence.offers || "[]");
  } catch {
    // ignore
  }
  const usps = parseJsonArray(intelligence.uniqueSellingPoints);
  const advantages = parseJsonArray(intelligence.competitiveAdvantages);

  return (
    <div className="space-y-6">
      <details className="gro-card" open>
        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
          <span className="font-medium text-white">More detail</span>
          <ChevronUp className="w-5 h-5 text-zinc-500 rotate-180" />
        </summary>
      </details>

      <Section
        title="Key features"
        description="Core functional capabilities that define your product."
        items={keyFeatures}
        icon={Star}
      />
      <Section
        title="Key benefits"
        description="Value that users gain from your product's features."
        items={keyBenefits}
        icon={Check}
      />
      <Section
        title="Target pain points"
        description="Specific problems your product solves for users."
        items={painPoints}
        icon={Circle}
      />
      <Section
        title="Primary use cases"
        description="Main scenarios where users apply your product."
        items={useCases}
        icon={Check}
      />
      <Section
        title="Target scenarios"
        description="Specific situations or triggers that lead users to need your product."
        items={scenarios}
        icon={Star}
      />

      <div className="gro-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white">Offers</h3>
          <button type="button" className="text-xs text-zinc-500 hover:text-white">Edit</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {offers.map((o, i) => (
            <div key={i} className="p-4 rounded-lg bg-zinc-800/50 border border-gro-border">
              <p className="font-medium text-white">{o.title}</p>
              {o.price && <p className="text-sm text-zinc-400">{o.price}</p>}
              {o.savings && <p className="text-sm text-green-400">{o.savings}</p>}
              {o.includes && <p className="text-xs text-zinc-500 mt-1">{o.includes}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="gro-card p-5">
        <h3 className="font-medium text-white mb-3">Value proposition</h3>
        {intelligence.positioningStatement && (
          <div className="mb-4">
            <p className="text-xs text-zinc-500 mb-1">Positioning statement</p>
            <p className="text-sm text-zinc-300">{intelligence.positioningStatement}</p>
          </div>
        )}
        <div className="mb-4">
          <p className="text-xs text-zinc-500 mb-2">Unique selling points</p>
          <ul className="space-y-1">
            {usps.map((u, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {u}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-2">Competitive advantages</p>
          <ul className="space-y-1">
            {advantages.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  items,
  icon: Icon,
}: {
  title: string;
  description: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (items.length === 0) return null;
  return (
    <div className="gro-card p-5">
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 mb-3">{description}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
            <Icon className="w-4 h-4 text-gro-purple shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
