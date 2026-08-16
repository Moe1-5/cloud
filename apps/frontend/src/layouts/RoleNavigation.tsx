import { createContext, useContext, type ReactNode } from "react";

const RoleNavigationContext = createContext<ReactNode>(null);

export function RoleNavigationProvider({
  children,
  navigation
}: {
  children: ReactNode;
  navigation: ReactNode;
}) {
  return (
    <RoleNavigationContext.Provider value={navigation}>{children}</RoleNavigationContext.Provider>
  );
}

export function RoleNavigation() {
  const navigation = useContext(RoleNavigationContext);

  return navigation ? <div className="role-navigation-slot">{navigation}</div> : null;
}

export function CoordinatorPageHero({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  const navigation = useContext(RoleNavigationContext);

  if (!navigation) {
    return null;
  }

  return (
    <section className="top-band">
      <div className="top-band__content top-band__content--single">
        <div>
          <p className="eyebrow">Relief coordination</p>
          <h1>{title}</h1>
          <p className="intro">{description}</p>
        </div>
      </div>
    </section>
  );
}
