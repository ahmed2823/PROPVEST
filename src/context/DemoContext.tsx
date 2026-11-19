import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type Investment = {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
};

type DemoContextValue = {
  investments: Investment[];
  additionalInvested: number;
  recordInvestment: (propertyId: string, amount: number) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const value = useMemo(
    () => ({
      investments,
      additionalInvested: investments.reduce((total, item) => total + item.amount, 0),
      recordInvestment: (propertyId: string, amount: number) => {
        setInvestments((current) => [
          {
            id: `${Date.now()}`,
            propertyId,
            amount,
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          },
          ...current,
        ]);
      },
    }),
    [investments],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
